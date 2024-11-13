import numpy as np
from TFIDF import TFIDFVectorizer, CosineSimilarity 

q = "Should I use two RAM sticks instead of one"
tag = "two ram sticks vs one" 

q_token = q.lower().split(" ") 
tag_token = tag.lower().split(" ")  

l = TFIDFVectorizer(query_tokenized=q_token, tag_tokenized=tag_token) 
l,m = l.vectorize()
sim = CosineSimilarity(query_vector=l, tag_vector=m)
print(f"l == {l}\n m == {m}")
print(f"Similarity between two phrases = {sim.cosine_similarity()}")


