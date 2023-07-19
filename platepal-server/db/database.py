import pymongo
import os

uri = str(os.environ.get('COSMOSDB_URI'))
db_name = str(os.environ.get('DATABASE_NAME'))

class Database:
    def __init__(self):
        self.client = pymongo.MongoClient(uri)
        self.db = self.client[db_name]

    def get_collection(self, collection_name):
        return self.db[collection_name]
