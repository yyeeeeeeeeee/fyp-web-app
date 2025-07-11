# -*- coding: utf-8 -*-
"""Copy of spotify-recommendation-engine.ipynb

Automatically generated by Colab.
Original file is located at
    https://colab.research.google.com/drive/1V_1tkHD6-20BWejyYcVGxNTvtrcNMZch

## Dependencies
"""

import pandas as pd
import numpy as np
import json
import re
import sys
import itertools

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import MinMaxScaler
import matplotlib.pyplot as plt

import warnings
warnings.filterwarnings("ignore")

import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from spotipy.oauth2 import SpotifyOAuth
import spotipy.util as util

# Commented out IPython magic to ensure Python compatibility.
# %matplotlib inline

#If you're not familiar with this, save it! Makes using jupyter notebook on laptops much easier
from IPython.core.display import display, HTML
display(HTML("<style>.container { width:90% !important; }</style>"))

#another useful command to make data exploration easier
# NOTE: if you are using a massive dataset, this could slow down your code.
pd.set_option('display.max_columns', None)
pd.set_option("display.max_rows", None)

"""## Summary:"""
"""## 1. Data Exploration/Preparation
"""

import numpy as np
import pandas as pd
spotify_df = pd.read_csv('spotify_data.csv')
spotify_df.head()

"""Observations:
1. This data is at a **song level**
2. Many numerical values that I'll be able to use to compare movies (liveness, tempo, valence, etc)
2. Release date will useful but I'll need to create a OHE variable for release date in 5 year increments
3. Similar to 2, I'll need to create OHE variables for the popularity. I'll also use 5 year increments here
4. There is nothing here related to the genre of the song which will be useful. This data alone won't help us find relavent content since this is a content based recommendation system. Fortunately there is a `data_w_genres.csv` file that should have some useful information
"""

data_w_genre = pd.read_csv('spotify_data.csv')
data_w_genre.head()

"""Observations:
1. This data is at an **artist level**
2. There are similar continuous variables as our initial dataset but I won't use this. I'll just use the values int he previous dataset.
3. The genres are going to be really useful here and I'll need to use it moving forward. Now, the genre column appears to be in a list format but my past experience tells me that it's likely not. Let's investigate this further.
"""

data_w_genre.dtypes

"""This checks whether or not `genres` is actually in a list format:"""

data_w_genre['playlist_genre'].values[0]


"""As we can see, it's actually a string that looks like a list. Now, look at the example above, I'm going to put together a regex statement to extract the genre and input into a list"""

data_w_genre['genres_upd'] = data_w_genre.apply(
    lambda row: [row['playlist_genre'], row['playlist_subgenre']],
    axis=1
)

data_w_genre['genres_upd'].values[0]
data_w_genre['genres_upd'].values[0][0]

"""Voila, now we have the genre column in a format we can actually use. If you go down, you'll see how we use it.

Now, if you recall, this data is at a artist level and the previous dataset is at a song level. So what here's what we need to do:
1. Explode artists column in the previous so each artist within a song will have their own row
2. Merge `data_w_genre` to the exploded dataset in Step 1 so that the previous dataset no is enriched with genre dataset

Before I go further, let's complete these two steps.

Step 1.
Similar to before, we will need to extract the artists from the string list.
"""

spotify_df['artists_upd_v1'] = spotify_df['track_artist'].str.split(',').apply(lambda x: [i.strip() for i in x])

spotify_df['track_artist'].values[0]
spotify_df['artists_upd_v1'].values[0][0]

"""This looks good but did this work for every artist string format. Let's double check"""

spotify_df[spotify_df['artists_upd_v1'].apply(lambda x: not x)].head(5)

"""So, it looks like it didn't catch all of them and you can quickly see that it's because artists with an apostrophe in their title and the fact that they are enclosed in a full quotes. I'll write another regex to handle this and then combine the two"""

spotify_df['artists_upd_v2'] = spotify_df['track_artist'].apply(lambda x: re.findall('\"(.*?)\"',x))
spotify_df['artists_upd'] = np.where(spotify_df['artists_upd_v1'].apply(lambda x: not x), spotify_df['artists_upd_v2'], spotify_df['artists_upd_v1'] )

#need to create my own song identifier because there are duplicates of the same song with different ids. I see different
spotify_df['artists_song'] = spotify_df.apply(lambda row: row['artists_upd'][0]+row['track_name'],axis = 1)

spotify_df.sort_values(['artists_song','track_album_release_date'], ascending = False, inplace = True)

spotify_df[spotify_df['track_name']=='Taste']

spotify_df.drop_duplicates('artists_song',inplace = True)

spotify_df[spotify_df['track_name']=='Taste']

"""Now I can explode this column and merge as I planned to in `Step 2`"""

artists_exploded = spotify_df[['artists_upd','id']].explode('artists_upd')

artists_exploded_enriched = artists_exploded.merge(data_w_genre, how = 'left', left_on = 'artists_upd',right_on = 'track_artist')
artists_exploded_enriched_nonnull = artists_exploded_enriched[~artists_exploded_enriched.genres_upd.isnull()]

# Drop 'id' from data_w_genre if only the one in artists_exploded matters
artists_exploded_enriched = artists_exploded.merge(
    data_w_genre.drop(columns=['id']),
    how='left',
    left_on='artists_upd',
    right_on='track_artist'
)
artists_exploded_enriched_nonnull = artists_exploded_enriched[~artists_exploded_enriched.genres_upd.isnull()]

artists_exploded_enriched_nonnull[artists_exploded_enriched_nonnull['id'] =='2plbrEY59IikOBgBGLjaoe']

"""Alright we're almost their, now we need to:
1. Group by on the song `id` and essentially create lists lists
2. Consilidate these lists and output the unique values
"""

artists_genres_consolidated = artists_exploded_enriched_nonnull.groupby('id')['genres_upd'].apply(list).reset_index()

artists_genres_consolidated['consolidates_genre_lists'] = artists_genres_consolidated['genres_upd'].apply(lambda x: list(set(list(itertools.chain.from_iterable(x)))))

artists_genres_consolidated.head()

spotify_df = spotify_df.merge(artists_genres_consolidated[['id','consolidates_genre_lists']], on = 'id',how = 'left')

spotify_df

"""## 2. Feature Engineering

### - Normalize float variables
### - OHE Year and Popularity Variables
### - Create TF-IDF features off of artist genres
"""

spotify_df.tail()

spotify_df['year'] = spotify_df['track_album_release_date'].apply(lambda x: x.split('-')[0])

float_cols = spotify_df.dtypes[spotify_df.dtypes == 'float64'].index.values

ohe_cols = 'track_popularity'

spotify_df['track_popularity'].describe()

# create 5 point buckets for popularity
spotify_df['popularity_red'] = spotify_df['track_popularity'].apply(lambda x: int(x/5))

# tfidf can't handle nulls so fill any null values with an empty list
spotify_df['consolidates_genre_lists'] = spotify_df['consolidates_genre_lists'].apply(lambda d: d if isinstance(d, list) else [])

spotify_df.head()

#simple function to create OHE features
#this gets passed later on
def ohe_prep(df, column, new_name):
    """
    Create One Hot Encoded features of a specific column

    Parameters:
        df (pandas dataframe): Spotify Dataframe
        column (str): Column to be processed
        new_name (str): new column name to be used

    Returns:
        tf_df: One hot encoded features
    """

    tf_df = pd.get_dummies(df[column])
    feature_names = tf_df.columns
    tf_df.columns = [new_name + "|" + str(i) for i in feature_names]
    tf_df.reset_index(drop = True, inplace = True)
    return tf_df


#function to build entire feature set
def create_feature_set(df, float_cols):
    """
    Process spotify df to create a final set of features that will be used to generate recommendations

    Parameters:
        df (pandas dataframe): Spotify Dataframe
        float_cols (list(str)): List of float columns that will be scaled

    Returns:
        final: final set of features
    """

    #tfidf genre lists
    tfidf = TfidfVectorizer()
    tfidf_matrix =  tfidf.fit_transform(df['consolidates_genre_lists'].apply(lambda x: " ".join(x)))
    genre_df = pd.DataFrame(tfidf_matrix.toarray())
    genre_df.columns = ['genre' + "|" + i for i in tfidf.get_feature_names_out()]
    genre_df.reset_index(drop = True, inplace=True)

    #explicity_ohe = ohe_prep(df, 'explicit','exp')
    year_ohe = ohe_prep(df, 'year','year') * 0.5
    popularity_ohe = ohe_prep(df, 'popularity_red','pop') * 0.15

    #scale float columns
    floats = df[float_cols].reset_index(drop = True)
    scaler = MinMaxScaler()
    floats_scaled = pd.DataFrame(scaler.fit_transform(floats), columns = floats.columns) * 0.2

    #concanenate all features
    final = pd.concat([genre_df, floats_scaled, popularity_ohe, year_ohe], axis = 1)

    #add song id
    final['id']=df['id'].values

    return final

complete_feature_set = create_feature_set(spotify_df, float_cols=float_cols)#.mean(axis = 0)

complete_feature_set.head()

"""## 3. Connect to Spotify API

Useful links:
1. https://developer.spotify.com/dashboard/
2. https://spotipy.readthedocs.io/en/2.16.1/
"""

#client id and secret for my application
client_id = 'b58f97e2f31249428194375fd2b32103'
client_secret= '1ee79e07e44d49a3a289b76157d96968'

scope = {
    'user-library-read',
    'playlist-read-private',
'playlist-read-collaborative'
}

if len(sys.argv) > 1:
    username = sys.argv[1]
else:
    print("Usage: %s username" % (sys.argv[0],))
    sys.exit()

auth_manager = SpotifyClientCredentials(client_id=client_id, client_secret=client_secret)
sp = spotipy.Spotify(auth_manager=auth_manager)

token = util.prompt_for_user_token(scope, client_id= client_id, client_secret=client_secret, redirect_uri='http://127.0.0.1:8888/')

sp = spotipy.Spotify(auth=token)

#gather playlist names and images.
#images aren't going to be used until I start building a UI
id_name = {}
list_photo = {}
#print("sp current user:",sp.current_user()['display_name'])  # This shows who you're authenticated as
#playlists = sp.current_user_playlists()
#print(json.dumps(playlists, indent=2))  # see what you're actually getting

for i in sp.current_user_playlists()['items']:
    id_name[i['name']] = i['uri'].split(':')[2]
    list_photo[i['uri'].split(':')[2]] = i['images'][0]['url']

print("id name:", id_name)

def create_necessary_outputs(playlist_name,id_dic, df):
    """
    Pull songs from a specific playlist.

    Parameters:
        playlist_name (str): name of the playlist you'd like to pull from the spotify API
        id_dic (dic): dictionary that maps playlist_name to playlist_id
        df (pandas dataframe): spotify datafram

    Returns:
        playlist: all songs in the playlist THAT ARE AVAILABLE IN THE KAGGLE DATASET
    """
    print(id_dic)

    #generate playlist dataframe
    playlist = pd.DataFrame()
    playlist_name = playlist_name

    for ix, i in enumerate(sp.playlist(id_dic[playlist_name])['tracks']['items']):
        #print(i['track']['artists'][0]['name'])
        playlist.loc[ix, 'artist'] = i['track']['artists'][0]['name']
        playlist.loc[ix, 'name'] = i['track']['name']
        playlist.loc[ix, 'id'] = i['track']['id'] # ['uri'].split(':')[2]
        playlist.loc[ix, 'url'] = i['track']['album']['images'][1]['url']
        playlist.loc[ix, 'date_added'] = i['added_at']

    playlist['date_added'] = pd.to_datetime(playlist['date_added'])

    playlist = playlist[playlist['id'].isin(df['id'].values)].sort_values('date_added',ascending = False)

    return playlist

id_name

#playlist_EDM = create_necessary_outputs('EDM', id_name,spotify_df)
#playlist_chill = create_necessary_outputs('chill',id_name, spotify_df)
#playlist_classical = create_necessary_outputs('Epic Classical',id_name, spotify_df)

from skimage import io
import matplotlib.pyplot as plt

def visualize_songs(df):
    """
    Visualize cover art of the songs in the inputted dataframe

    Parameters:
        df (pandas dataframe): Playlist Dataframe
    """

    temp = df['url'].values
    plt.figure(figsize=(15,int(0.625 * len(temp))))
    columns = 5

    for i, url in enumerate(temp):
        plt.subplot(len(temp) / columns + 1, columns, i + 1)

        image = io.imread(url)
        plt.imshow(image)
        plt.xticks(color = 'w', fontsize = 0.1)
        plt.yticks(color = 'w', fontsize = 0.1)
        plt.xlabel(df['name'].values[i], fontsize = 12)
        plt.tight_layout(h_pad=0.4, w_pad=0)
        plt.subplots_adjust(wspace=None, hspace=None)

    plt.show()

#playlist_EDM

"""## 4. Create Playlist Vector"""

def generate_playlist_feature(complete_feature_set, playlist_df, weight_factor):
    """
    Summarize a user's playlist into a single vector

    Parameters:
        complete_feature_set (pandas dataframe): Dataframe which includes all of the features for the spotify songs
        playlist_df (pandas dataframe): playlist dataframe
        weight_factor (float): float value that represents the recency bias. The larger the recency bias, the most priority recent songs get. Value should be close to 1.

    Returns:
        playlist_feature_set_weighted_final (pandas series): single feature that summarizes the playlist
        complete_feature_set_nonplaylist (pandas dataframe):
    """

    complete_feature_set_playlist = complete_feature_set[complete_feature_set['id'].isin(playlist_df['id'].values)]#.drop('id', axis = 1).mean(axis =0)
    complete_feature_set_playlist = complete_feature_set_playlist.merge(playlist_df[['id','date_added']], on = 'id', how = 'inner')
    complete_feature_set_nonplaylist = complete_feature_set[~complete_feature_set['id'].isin(playlist_df['id'].values)]#.drop('id', axis = 1)

    playlist_feature_set = complete_feature_set_playlist.sort_values('date_added',ascending=False)

    most_recent_date = playlist_feature_set.iloc[0,-1]

    for ix, row in playlist_feature_set.iterrows():
        playlist_feature_set.loc[ix,'months_from_recent'] = int((most_recent_date.to_pydatetime() - row.iloc[-1].to_pydatetime()).days / 30)

    playlist_feature_set['weight'] = playlist_feature_set['months_from_recent'].apply(lambda x: weight_factor ** (-x))

    playlist_feature_set_weighted = playlist_feature_set.copy()
    #print(playlist_feature_set_weighted.iloc[:,:-4].columns)
    playlist_feature_set_weighted.update(playlist_feature_set_weighted.iloc[:,:-4].mul(playlist_feature_set_weighted.weight,0))
    playlist_feature_set_weighted_final = playlist_feature_set_weighted.iloc[:, :-4]
    #playlist_feature_set_weighted_final['id'] = playlist_feature_set['id']

    return playlist_feature_set_weighted_final.sum(axis = 0), complete_feature_set_nonplaylist

#complete_feature_set_playlist_vector_EDM, complete_feature_set_nonplaylist_EDM = generate_playlist_feature(complete_feature_set, playlist_EDM, 1.09)
#complete_feature_set_playlist_vector_chill, complete_feature_set_nonplaylist_chill = generate_playlist_feature(complete_feature_set, playlist_chill, 1.09)

#complete_feature_set_playlist_vector_EDM.shape

"""## 5. Generate Recommendations"""

def generate_playlist_recos(df, features, nonplaylist_features):
    """
    Pull songs from a specific playlist.

    Parameters:
        df (pandas dataframe): spotify dataframe
        features (pandas series): summarized playlist feature
        nonplaylist_features (pandas dataframe): feature set of songs that are not in the selected playlist

    Returns:
        non_playlist_df_top_40: Top 40 recommendations for that playlist
    """

    non_playlist_df = df[df['id'].isin(nonplaylist_features['id'].values)]
    non_playlist_df['sim'] = cosine_similarity(nonplaylist_features.drop('id', axis = 1).values, features.values.reshape(1, -1))[:,0]
    non_playlist_df_top_40 = non_playlist_df.sort_values('sim',ascending = False).head(40)
    non_playlist_df_top_40['url'] = non_playlist_df_top_40['id'].apply(lambda x: sp.track(x)['album']['images'][1]['url'])

    return non_playlist_df_top_40

#edm_top40 = generate_playlist_recos(spotify_df, complete_feature_set_playlist_vector_EDM, complete_feature_set_nonplaylist_EDM)


#edm_top40

#chill_top40 = generate_playlist_recos(spotify_df, complete_feature_set_playlist_vector_chill, complete_feature_set_nonplaylist_chill)

def main():
    results = {}  # Dictionary to store results for id_name

    for playlist_name, playlist_id in id_name.items():
        results[playlist_id] = {}
        for col in ['playlist_genre', 'playlist_subgenre', 'track_artist']:
            for value in spotify_df[col].unique():
                playlist = create_necessary_outputs(value, id_name, spotify_df)
                if playlist is None or len(playlist) == 0:
                    continue

                vec_playlist, vec_nonplaylist = generate_playlist_feature(complete_feature_set, playlist, 1.09)
                top40 = generate_playlist_recos(spotify_df, vec_playlist, vec_nonplaylist)

                results[playlist_id][f"{col}:{value}"] = {
                    'playlist': playlist,
                    'complete_feature_set_playlist_vector': vec_playlist,
                    'complete_feature_set_nonplaylist': vec_nonplaylist,
                    'top40': top40
                }

    print("Results: ", results)

    # Now you can access each result using the playlist_id key
    # Example: results['some_playlist_id']['playlist'], results['some_playlist_id']['top40']

if __name__ == "__main__":
    main()
