# recommend.py
import sys
import json
import pickle
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def load_model_components():
    model_path = os.path.join(os.path.dirname(__file__), 'models')
    
    # Load all components
    with open(os.path.join(model_path, 'tfidf_vectorizer.pkl'), 'rb') as f:
        tfidf = pickle.load(f)
    
    with open(os.path.join(model_path, 'similarity_matrix.pkl'), 'rb') as f:
        similarity_matrix = pickle.load(f)
    
    with open(os.path.join(model_path, 'movies_data.pkl'), 'rb') as f:
        movies_df = pickle.load(f)
    
    return tfidf, similarity_matrix, movies_df

def get_recommendations(title, n_recommendations=5, rec_type='general'):

    tfidf, similarity_matrix, movies_df = load_model_components()
    
    if rec_type == 'actors':
        return get_actor_recommendations(title, movies_df, n_recommendations)
    elif rec_type == 'genre':
        return get_genre_recommendations(title, n_recommendations)
    
    try:
        idx = movies_df[movies_df['title'] == title].index[0]
    except IndexError:
        return []
    
    similarity_scores = list(enumerate(similarity_matrix[idx]))
    similarity_scores = sorted(similarity_scores, key=lambda x: x[1], reverse=True)
    
    similar_movies = similarity_scores[1:int(n_recommendations)+1]
    
    recommendations = []
    for i, score in similar_movies:
        movie = movies_df.iloc[i]
        recommendations.append({
            'title': movie['title'],
            'year': int(movie['year']),
            'genres': movie['genres'],
            'actors': movie['actors'],
            'similarity_score': float(score)
        })
    
    return recommendations


def get_actor_recommendations(actor_name, n_recommendations=5):
    _, _, movies_df = load_model_components()
    
    try:
        # Find all movies with this actor
        movies_with_actor = movies_df[movies_df['actors'].apply(lambda x: actor_name in x if isinstance(x, list) else False)]
        
        if movies_with_actor.empty:
            return {'error': f'Actor "{actor_name}" not found in databa se'}
        
        return {
            'actor': actor_name,
            'movies': movies_with_actor[['title', 'year', 'genres', 'actors']]
            .head(int(n_recommendations))
            .to_dict('records')
        }
    except Exception as e:
        return {'error': f'Error processing actor recommendations: {str(e)}'}



def get_genre_recommendations(genre, n_recommendations=5):
    _, _, movies_df = load_model_components()
    
    try:
        movies_with_genre = movies_df[movies_df['genres'].apply(lambda x: genre in x if isinstance(x, list) else False)]
        
        if movies_with_genre.empty:
            return {'error': f'Genre "{genre}" not found in database'}
        
        return {
            'genre': genre,
            'movies': movies_with_genre[['title', 'year', 'genres', 'actors']]
            .head(n_recommendations)
            .to_dict('records')
        }
    except Exception as e:
        return {'error': f'Error processing genre recommendations: {str(e)}'}


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({'error': 'Search term required'}))
        sys.exit(1)
    
    search_term = sys.argv[1]
    limit = int(sys.argv[2]) if len(sys.argv) > 2 else 5
    search_type = sys.argv[3] if len(sys.argv) > 3 else 'general'
    
    if search_type == 'actor':
        recommendations = get_actor_recommendations(search_term, limit)
    elif search_type == 'genre':
        recommendations = get_genre_recommendations(search_term, limit)
    else:
        recommendations = get_recommendations(search_term, limit, search_type)

    print(json.dumps(recommendations))
    

