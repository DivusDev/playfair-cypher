# CREATED BY TRISTAN SCHWICHOW

import sys
import json
from os import listdir

# Math
import pandas as pd
import numpy as np

# Plotting libraries
import matplotlib.pyplot as plt
import numpy as np; np.random.seed(0)
import seaborn as sns; sns.set_theme()



# ************************************* VARIABLES *************************************

# Needed Variables
frequencies_object = {}                # Frequencies Object
frequencies_matrix = []         # Frequencies Matrix
labels_matrix = []              # Matrix of labels for heatmap
lastCharacter = 'A'              # last Character Seen
count = 0                       # total characters seen per file


# default frequencies
for i in range(26):
    frequencies_matrix.append([])
    labels_matrix.append([])
    for j in range(26):
        pair = chr(65 + i) + chr(65 + j)
        frequencies_matrix[i].append(0)
        labels_matrix[i].append(pair)
        frequencies_object[pair] = 0


# Retrieve all filenames from ./scrape_texts directory
text_file_names = listdir('scrape_texts')

# If there are arguments passed then use those names instead
if len(sys.argv) != 1:
    text_file_names = sys.argv[1:]



# ************************************* PARSING *************************************

# Keep count of all characters processed and for each file
total_characters = 0
file_character_count = 0
# Run through all files passed as arguments
for filename in text_file_names:
    # Add and reset counts
    total_characters += file_character_count
    file_character_count = 0

    # Open current file
    currentFile = open('scrape_texts/' + filename, 'r')
    

    # Run through all lines in opened file
    for line in currentFile:

        # Run through all characters in line
        for character in line:
            # if the current character is not a alphabetical character skip it
            if ord(character) < 65 or ord(character) > 90 and ord(character) < 97 or ord(character) > 122 : continue
            # capitalize the character, playfair cypher only uses capitals
            character = character.capitalize()
            # force J to I
            if character == 'J': character = 'I'
                
            if lastCharacter == character:
                # special Case for duplicate letters 
                lastCharacter = character
                # pseudo add an X between duplicate characters, as by playfair convention
                # count both the first pair and second pair of the 3 pair frequency

                # AA -> AXA 

                # Counting AX
                frequencies_object[character + 'X'] += 1                               # Add count to object
                frequencies_matrix[ord(character) - 65][ord('X') - 65] += 1             # Add count to matrix

                # Counting XA
                frequencies_object['X' + character] += 1                               # Add count to object
                frequencies_matrix[ord('X') - 65][ord(character) - 65] += 1             # Add count to matrix

                # Account for double count
                file_character_count += 1
            else:
                # write down current duo
                frequencies_object[lastCharacter + character] += 1                               # Add count to object
                frequencies_matrix[ord(lastCharacter) - 65][ord(character) - 65] += 1     # Add count to matrix

            # remember character and continue
            lastCharacter = character
            file_character_count += 1


# ************************************* DATA PROCESSING *************************************


# All passed files have been processed.
# Produce json output

# show total characters processed to user
print(f"Total Characters Processed: {total_characters}")


# Open output file
output = open('test_english_letter_frequencies.json', 'w')

# create a compound object containing both object and matrix interpretation

Frequencies = {
    'map': frequencies_object,
    'matrix': frequencies_matrix,
    "count": total_characters
}

# create json object of frequencies
frequencies_json = json.dumps(Frequencies)

# write to file
output.write(frequencies_json)




# ************************************* PLOTTING *************************************


# Create pandas df with data -- theres really no reason to do this ????
df = pd.DataFrame(
    frequencies_matrix,
            index=[chr(65 + i) for i in range(26)], # Row names
            columns=[chr(65 + i) for i in range(26)] # Column names
            )
# Create labels np array
np_labels = np.array(labels_matrix)

# combining text with values and making new labels matrix thats correctly formatted
formatted_text = (np.asarray(["{0}\n{1}".format(
    text, data) for text, data in zip(np_labels.flatten(), np.array(df).flatten())])).reshape(26, 26)


# Change size of figure so boxes arnt so tiny
fig, ax = plt.subplots(figsize=(60, 30))

# Actually create heatmap, set color and labels inside squares
hm = sns.heatmap(df, annot=formatted_text, fmt="", linewidths=1, cmap="Spectral_r")
# Name heatmap
hm.set( ylabel='First Letter', xlabel='Second Letter', title='Heatmap of Biletter Frequencies')

# Set labels of heatmap
plt.xticks(np.arange(26) + 0.5, list(df.index))
plt.yticks(np.arange(26) + 0.5, list(df.index), rotation=0)

# invert Y axis so A's start next to each other and increase from bottom left
ax.invert_yaxis()

# Display heatmap and save as heatmap.png
plt.show()
hm.figure.savefig('heatmap.png')


# Done ????






