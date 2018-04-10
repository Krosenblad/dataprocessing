#!/usr/bin/env python
# Name: Kajsa Rosenblad
# Student number: 11361840
"""
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
"""
import csv
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup
import re

TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'


def extract_tvseries(dom):
    """
    Uses Beautiful Soup library to scrape information from IMDB, appending it 
    to separate lists, then lastly joining lists and returning the information.
    """
    
    # Create list for all movie titles
    title_list =[]
    for title in dom('h3', 'lister-item-header'):
        text = title.contents[3]

        name = text.string
        title_list.append(name) 

    # Create list for all ratings
    rate_list = []
    for rate in dom('span', 'value'):
        rating = rate.text
        rate_list.append(rating)
    
    # Create list for all genres, strip \n and blank spaces
    genre_list = []    
    for genre in dom('span', 'genre'):
        genres = genre.string.strip('\n')
        genres = genres.strip()
        genre_list.append(genres)
    
    # Access info per movie, create two lists to append actors in chunks
    movie_actor = []
    all_actors = []
    
    for chunk in dom('div', 'lister-item-content'):

        for actor in chunk(href = re.compile('adv_li_st')):
            
            movie_actor.append(actor.string)
        
        # Make list item string, to make the CSV file look cohesive
        string = '{}, {}, {}, {}'.format(movie_actor[0], movie_actor[1],
            movie_actor[2], movie_actor[3])

        all_actors.append(string)
        
        movie_actor = []
     
    # Create list for runtime
    runtime_list = []
    for runtime in dom('span', 'runtime'):
        run = runtime.text.strip('min')
        runtime_list.append(run)

    # Collect all data per series, using two lists
    tvseries = []
    series = []
    for i in range(50):
        series.append(title_list[i])
        series.append(rate_list[i])
        series.append(genre_list[i])
        series.append(all_actors[i])
        series.append(runtime_list[i])
        
        # Append all information per serie, empty initial list
        tvseries.append(series)
        series = []

    return tvseries


def save_csv(outfile, tvseries):
    """
    Output a CSV file containing highest rated TV-series.
    """
    writer = csv.writer(outfile)
    writer.writerow(['Title', 'Rating', 'Genre', 'Actors', 'Runtime'])

    for i in range (50):
        writer.writerow(tvseries[i])
    


def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None
    except RequestException as e:
        print('The following error occurred during HTTP GET request to {0} : {1}'.format(url, str(e)))
        return None


def is_good_response(resp):
    """
    Returns true if the response seems to be HTML, false otherwise
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find('html') > -1)


if __name__ == "__main__":

    # get HTML content at target URL
    html = simple_get(TARGET_URL)

    # save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # parse the HTML file into a DOM representation
    dom = BeautifulSoup(html, 'html.parser')


    # extract the tv series (using the function you implemented)
    tvseries = extract_tvseries(dom)

    # write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'w', newline='') as output_file:
        save_csv(output_file, tvseries)