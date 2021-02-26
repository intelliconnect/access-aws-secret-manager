# Use this code snippet in your app.
import boto3
from botocore.exceptions import ClientError
import json
import base64
import psycopg2

def get_secret():
    secret_name = "" #your secret name
    region_name = "" #your secret region

    # Create a Secrets Manager client
    session = boto3.session.Session()
    client = session.client(
        service_name='secretsmanager',
        region_name=region_name,
        aws_access_key_id = '', #add your access keys
        aws_secret_access_key = '' #add your access keys
    )

    try:
        get_secret_value_response = client.get_secret_value(
                SecretId=secret_name
            )
        
        print("Response",get_secret_value_response)
    except ClientError as e:
        if e.response['Error']['Code'] == 'ResourceNotFoundException':
            print("The requested secret " + secret_name + " was not found")
        elif e.response['Error']['Code'] == 'InvalidRequestException':
            print("The request was invalid due to:", e)
        elif e.response['Error']['Code'] == 'InvalidParameterException':
            print("The request had invalid params:", e)
    else:
        # Decrypted secret using the associated KMS CMK
        # Depending on whether the secret was a string or binary, one of these fields will be populated
        if 'SecretString' in get_secret_value_response:
            secret = get_secret_value_response['SecretString']
            print("Secret JSON : ",secret)
            # Get the user name, password, and database connection information from a config file.
            database = json.loads(secret)['dbname']
            user_name = json.loads(secret)['username']
            password = json.loads(secret)['password']
            host = json.loads(secret)['host']

            # Use the user name, password, and database connection information to connect to the database
	        #As we are using Postgres DB, 'psycopg2' module is used, in case of MYSQL, you can connect in similar way by using 'mysql.connector'
            db = psycopg2.connect(host=host,
                                    database=database,
                                    user=user_name,
                                    password=password)
	    
            #Query the table, Replace table name with your table name        
	        cursor = db.cursor()
            cursor.execute("Select * from user_login limit 1")
            print("Total Rows : ",cursor.rowcount)
            for row in cursor.fetchall():
               print("row",row)
            db.close()
        else:
            # binary_secret_data = get_secret_value_response['SecretBinary']
            secret = base64.b64decode(get_secret_value_response['SecretBinary'])

    return json.loads(secret)  # returns the secret as dictionary


