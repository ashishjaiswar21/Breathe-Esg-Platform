from django.db import models
from django.contrib.auth.models import User

# --------------------For  Multi-Tenancy Support

class Tenant(models.Model):
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

#   --------------------Tracking Source-of-Truth P

class DataSource(models.Model):
    SOURCE_TYPES = [
        ('SAP', 'SAP Fuel/Procurement'),
        ('UTILITY', 'Utility Portal'),
        ('TRAVEL', 'Corporate Travel API'),
    ]
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)
    source_type = models.CharField(max_length=50, choices=SOURCE_TYPES)
    file_name = models.CharField(max_length=255, blank=True, null=True) # If uploaded via CSV
    uploaded_at = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return f"{self.source_type} - {self.tenant.name}"

#--------------------------  Normalized Data Table
class EmissionRecord(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
    ]

    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)
    data_source = models.ForeignKey(DataSource, on_delete=models.CASCADE)
    
    #--------------------As we have to  Normalize the  Fields
    category = models.CharField(max_length=100) # e.g., Fuel, Electricity, Flight
    amount = models.FloatField()
    unit = models.CharField(max_length=50)      # e.g., Liters, kWh, km
    emission_factor = models.FloatField(null=True, blank=True) # Optional for now

    #--------------------for Analyst Review System
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    validation_errors = models.TextField(null=True, blank=True)
    is_suspicious = models.BooleanField(default=False)
    
    #--------------------Lock for Audit!
    is_locked = models.BooleanField(default=False) 

    def __str__(self):
        return f"{self.category}: {self.amount} {self.unit} - {self.status}"

# --------------------for  Audit Trail
class AuditLog(models.Model):
    record = models.ForeignKey(EmissionRecord, on_delete=models.CASCADE, related_name="audit_logs")
    action = models.CharField(max_length=255) # e.g., "Status changed from PENDING to APPROVED"
    old_value = models.TextField(null=True, blank=True)
    new_value = models.TextField(null=True, blank=True)
    changed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.action} on Record {self.record.id}"


