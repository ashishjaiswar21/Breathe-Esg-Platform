import pandas as pd

def normalize_unit(raw_unit):
    """Converts messy units into a single standard format."""
    if pd.isna(raw_unit):
        return "Unknown"
    
    unit = str(raw_unit).lower().strip()
    if unit in ['l', 'litre', 'liters', 'liter']:
        return 'Liters'
    elif unit in ['kwh', 'kilowatt-hour', 'kilowatts']:
        return 'kWh'
    return raw_unit

def validate_row(amount):
    """Checks for errors or suspicious data."""
    errors = ""
    is_suspicious = False

    if pd.isna(amount):
        return "Missing amount", True
    
    try:
        amount = float(amount)
        if amount < 0:
            errors = "Amount cannot be negative"
        elif amount > 50000:  # Arbitrary high number for testing
            is_suspicious = True
    except ValueError:
        errors = "Invalid number format"

    return errors, is_suspicious