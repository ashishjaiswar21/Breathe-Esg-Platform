import requests

# T--------------------he URL of your local server
url = 'http://127.0.0.1:8000/api/upload/sap/'

# --------------------Open the CSV file we made earlier
file_path = 'sample_data/sap_export.csv'

with open(file_path, 'rb') as f:
    # --------------------Send the file via POST request
    response = requests.post(url, files={'file': f})

# --------------------Print the server's response!
print(response.json())