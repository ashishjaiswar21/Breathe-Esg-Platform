from django.urls import path
from .views import UploadSAPDataView, MockTravelAPIView, EmissionRecordListView

urlpatterns = [
    path('upload/sap/', UploadSAPDataView.as_view(), name='upload_sap'),
    path('sync/travel/', MockTravelAPIView.as_view(), name='sync_travel'),
    path('records/', EmissionRecordListView.as_view(), name='get_records'), # 👈 NEW!
]