import os, glob, re

# Fix [category]/page.js view details link
path = "src/app/services/[category]/page.js"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(
    '<a className=\"view-details-link\" style={{ color: \'#6366f1\', fontWeight: \'700\', fontSize: \'13px\', cursor: \'pointer\' }}>',
    '<a className=\"view-details-link\" onClick={(e) => { e.preventDefault(); setViewDetailsItem(item); setViewDetailsSectionId(category.id); }} style={{ color: \'#6366f1\', fontWeight: \'700\', fontSize: \'13px\', cursor: \'pointer\' }}>'
)
with open(path, "w", encoding="utf-8") as f:
    f.write(content)

# Fix specific pages onClick
for filepath in glob.glob("src/app/**/page.js", recursive=True):
    if "[category]" in filepath: continue
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    if "key={service.id}" in content and "setSelectedService" in content:
        content = re.sub(r"(key=\{service\.id\}\s*)style=", r"\1onClick={() => setSelectedService(service)}\n                        style=", content)
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
            
print("done")
