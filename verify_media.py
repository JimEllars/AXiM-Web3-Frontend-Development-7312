import sys
from utils.media import read_media_file

def verify():
    read_media_file(filepath='/home/jules/verification/screenshots/home_articles.png')
    read_media_file(filepath='/home/jules/verification/screenshots/articles_page.png')
    read_media_file(filepath='/home/jules/verification/videos/fb9fdf097c2f748c6f8c8c901ab8daf4.webm')

if __name__ == "__main__":
    verify()
