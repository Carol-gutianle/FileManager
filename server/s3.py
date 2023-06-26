"""
这是一个S3树的类
"""
import boto3

class S3:
    def __init__(self, ak, sk) -> None:
        self.ak = ak
        self.sk = sk
        # 默认连接
        self.s3 = self.connect()
    
    def connect(self):
        s3 = boto3.client(
            's3',
            aws_access_key_id=self.ak,
            aws_secret_access_key=self.sk
        )
        try:
            response = s3.list_buckets()
            print('=====连接成功=====')
        except Exception as e:
            print(e)
        return s3
    
    def listFiles(self):
        pass
    
if __name__ == '__main__':
    instance = S3('CKGEB5PPRMCTTCT8H3OE', 'VcDvkuKFNORfChhJEsNLRODTeMSRxpppMrLnSTP2')
    