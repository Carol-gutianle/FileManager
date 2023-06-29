"""
这是一个S3树的类
"""
import boto3
from typing import Optional
from petrel_client.client import Client
import json

class S3:
    def __init__(self) -> None:
        self.client = Client()
    
    def list(path: str):
        return list(self.client.list(path))
    
    def walk(self, path:str, suffix: Optional[str]=None):
        if not path.endswith('/'):
            path += '/'
        dir_name = path.split('/')[-2]  # 获取当前文件夹的名称
        file_tree = {"text": dir_name, "children": []}
        dir_list = self.client.list(path)
        for sub_path in dir_list:
            if sub_path.endswith('/'):
                sub_tree = self.walk(path + sub_path, suffix)
                if sub_tree["children"]:
                    file_tree["children"].append(sub_tree)
            else:
                if suffix is None or sub_path.endswith(suffix):
                    file_tree["children"].append({"text": sub_path})
        return file_tree    