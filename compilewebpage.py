import os
import re

def compilewebpage(outputfile, htmlfile, cssfiles, jsfiles):
    with open(htmlfile, 'r') as f:
        html = f.read()

    styletags = re.findall(r"\<link.*\>", html)
    for cssfile in cssfiles:
        with open(cssfile, 'r') as f:
            css = f.read()
        for st in styletags:
            if cssfile in st:
                html = html.replace(st, "<!--" + st + "-->")
        endofhead = html.find("</head>")
        while html[endofhead - 1] in [" ", "\t", "\n", "\r"]:
            endofhead -= 1
        html = html[:endofhead] + "\n<style>\n" + css + "\n</style>" + html[endofhead:]

    scripttags = re.findall(r"\<script.*\</script\>", html)
    for jsfile in jsfiles:
        with open(jsfile, 'r') as f:
            js = f.read()
        for st in scripttags:
            if jsfile in st:
                if html[html.find(st) - 3] != "!":
                    html = html.replace(st, "<!--" + st + "-->")
        endofbody = html.find("</body>")
        while html[endofbody - 1] in [" ", "\t", "\n", "\r"]:
            endofbody -= 1
        html = html[:endofbody] + "\n<script>\n" + js + "\n</script>" + html[endofbody:]

    with open(outputfile, 'w') as f:
        f.write(html)
    return 0

def get_relevant_files(filetypes=[".html", ".css", ".js"]):
    files = {}
    for ft in filetypes:
        files[ft] = []
    for f in os.listdir():
        for ft in filetypes:
            if f[-len(ft):] == ft:
                files[ft].append(f)
    return files

def generate_blank_html(filename):
    html = "<html><head></head><body></body></html>"
    with open(filename, 'w') as f:
        f.write(html)
    return 0

if __name__ == "__main__":
    files = get_relevant_files()
    if len(files[".html"]) == 0:
        generate_blank_html("placeholder.html")
        files[".html"] = ["placeholder.html"]
    elif len(files[".html"]) > 1:
        # TODO pick file from list, or merge files?
        raise Exception("Multiple html files found, remove extras")

    compilewebpage(
        "compiled.html",
        files[".html"][0],
        files[".css"],
        files[".js"],
    )