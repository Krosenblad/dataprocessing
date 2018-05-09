# Code source: https://stackoverflow.com/questions/19697846/
# how-to-convert-csv-file-to-multiline-json
import csv
import json

file = 'scandi.csv'
json_file = 'scandi.json'

#Read CSV File
def read_CSV(file, json_file):
    csv_rows = []
    with open(file) as csvfile:
        reader = csv.DictReader(csvfile, delimiter = ";")
        field = reader.fieldnames
        print(field)
        for row in reader:
            print(row)
            csv_rows.extend([{field[i]:row[field[i]] for i in range(len(field))}])
        convert_write_json(csv_rows, json_file)

#Convert csv data into json
def convert_write_json(data, json_file):
    with open(json_file, "w") as f:
        f.write(json.dumps(data, sort_keys=False, indent=4, separators=(';', ': '))) #for pretty
        #f.write(json.dumps(data))


read_CSV(file,json_file)