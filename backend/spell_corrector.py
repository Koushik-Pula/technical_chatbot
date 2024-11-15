def levenshtein_distance(s1, s2):
    m, n = len(s1), len(s2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    for i in range(m + 1):
        for j in range(n + 1):
            if i == 0:
                dp[i][j] = j  # Insert all characters of s2
            elif j == 0:
                dp[i][j] = i  # Remove all characters of s1
            elif s1[i - 1] == s2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]  # Characters match
            else:
                dp[i][j] = 1 + min(dp[i - 1][j],    # Remove
                                   dp[i][j - 1],    # Insert
                                   dp[i - 1][j - 1])  # Replace
    return dp[m][n]


def get_close_matches(word, corpus, n=3, cutoff=0.6):
    def similarity_score(w1, w2):
        max_len = max(len(w1), len(w2))
        if max_len == 0:
            return 1.0
        return 1 - (levenshtein_distance(w1, w2) / max_len)

    # Calculate similarity for all words in the corpus
    matches = [(candidate, similarity_score(word, candidate)) for candidate in corpus]

    # Filter by cutoff and sort by similarity score (descending)
    matches = [match[0] for match in sorted(matches, key=lambda x: x[1], reverse=True) if match[1] >= cutoff]

    # Return the top `n` matches
    return matches[:n]
