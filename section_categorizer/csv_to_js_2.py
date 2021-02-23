import pandas as pd

df = pd.read_csv("master.csv")

data = {}

for col in df:
    tmp_df = df[[col]].dropna().drop_duplicates()
    data[col] = list(map(str.lower, sorted(list(tmp_df[col]))))

d2 = data.copy()
m = max([len(v) for v in d2.values()])
for k,v in d2.items():
    if len(v) != m:
        v.extend(['' for _ in range(m - len(v))])

new_df = pd.DataFrame(d2)
new_df.to_csv("master.csv", index=False)


quote_wrap = lambda x: f'"{x}"'

out = 'const sectionData = {\n'
for k,v in data.items():
    out += f'  "{k}": {{\n'
    out += '    keywords: [\n'
    i = 0
    while i < len(v):
        out += f"      "
        for j in v[i:i+7]:
            if j:
                out += f"{quote_wrap(j)},"
        out += "\n"
        i += 7
        if not j:
            break
    out += '    ]\n'
    out += '  },\n'
out += '}'

with open("sectionData.js", "w") as f:
    f.write(out)

out = 'const sectionData2 = [\n'
for k,v in data.items():
    for i in v:
        if i:
            out += f"  {{\"cat\": {quote_wrap(k)}, \"ing\": {quote_wrap(i)}}},\n"
out += ']'

with open("sectionData2.js", "w") as f:
    f.write(out)

