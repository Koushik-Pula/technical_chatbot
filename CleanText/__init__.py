import re

class SentTokenize:
    def __init__(self, phrase) -> None:
        self.phrase = phrase

    def _special_char_removal(self):
        algo = re.sub("[^A-Za-z ]", " ", string=self.phrase)
        return algo 
    
    def _text_normalization(self):
        temp = self._special_char_removal() 
        temp = temp.lower().split() 
        return temp
    def get_tokenized_sentence(self):
        temp = self._special_char_removal()
        temp = self._text_normalization()
        return temp 
    

