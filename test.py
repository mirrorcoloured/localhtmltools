from flask import Flask, render_template

app = Flask(__name__, template_folder='./', static_folder='/')

@app.route('/')
def main():
    return render_template('voiceinput.html')

if __name__ == '__main__':
    app.run(port = 5057, debug = True)