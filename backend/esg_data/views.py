from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from .models import Tenant, DataSource, EmissionRecord
from .utils import normalize_unit, validate_row
import pandas as pd

class UploadSAPDataView(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request):
        file = request.FILES.get('file')
        if not file:
            return Response({"error": "No file provided"}, status=400)

        # ---------i created default Tenant for testing
        tenant, _ = Tenant.objects.get_or_create(name="Default Enterprise")
        
        # -------------for Track  source of truth
        data_source = DataSource.objects.create(
            tenant=tenant,
            source_type='SAP',
            file_name=file.name
        )

        try:
            df = pd.read_csv(file)
            
            # --------I done German to English mapping
            for index, row in df.iterrows():
                raw_fuel = row.get('Brennstoff', 'Unknown')
                raw_amount = row.get('Menge', 0)
                raw_unit = row.get('Einheit', '')

                # -----1. Normalize
                clean_unit = normalize_unit(raw_unit)
                
                # ---------2. Validate
                errors, suspicious = validate_row(raw_amount)

                # ----------3. Save Record
                EmissionRecord.objects.create(
                    tenant=tenant,
                    data_source=data_source,
                    category=raw_fuel,
                    amount=float(raw_amount) if not errors and not pd.isna(raw_amount) else 0,
                    unit=clean_unit,
                    validation_errors=errors if errors else None,
                    is_suspicious=suspicious
                )

            return Response({"message": "SAP Data processed successfully!"})
        except Exception as e:
            return Response({"error": str(e)}, status=500)


class MockTravelAPIView(APIView):
    """Simulates pulling JSON data from a Travel API like Concur"""
    
    def get(self, request):
        #---------- Mock JSON payload dta
        travel_data = [
            {"employee": "Rahul", "flight_distance_km": 1200},
            {"employee": "Shivang", "flight_distance_km": -50}, 
        ]

        tenant, _ = Tenant.objects.get_or_create(name="Default Enterprise")
        data_source = DataSource.objects.create(
            tenant=tenant, source_type='TRAVEL', file_name="API_PULL"
        )

        for trip in travel_data:
            dist = trip.get("flight_distance_km")
            errors, suspicious = validate_row(dist)

            EmissionRecord.objects.create(
                tenant=tenant,
                data_source=data_source,
                category="Flight",
                amount=dist if dist > 0 else 0,
                unit="km",
                validation_errors=errors if errors else None,
                is_suspicious=suspicious
            )

        return Response({"message": "Travel Data pulled and processed!"})
    
class EmissionRecordListView(APIView):
    """Fetches the actual database records for the React Frontend"""
    def get(self, request):
        # Grabbing  latest 50 records from the database
        records = EmissionRecord.objects.all().order_by('-id')[:50]
        data = []
        for rec in records:
            data.append({
                "id": rec.id,
                "source": rec.data_source.source_type if rec.data_source else "Unknown",
                "category": rec.category,
                "amount": rec.amount,
                "unit": rec.unit,
                "status": "PENDING", 
                 # Maintening a Default state for the analyst to review
                "is_suspicious": rec.is_suspicious,
                "error": rec.validation_errors
            })
        return Response(data)