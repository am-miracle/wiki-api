const express = require('express');
// const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: '.env' });

const CONNECTION_URL = process.env.CONNECTION_URL
const port = 3000;
const app = express();
// app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'))


mongoose.connect(CONNECTION_URL)

const articleSchema ={
    title: String,
    content: String
}

const Article = mongoose.model('article', articleSchema);

app.route("./articles")
    .get((req, res) => {
        Article.find((err, foundArticles) => {
            if(!err){
                res.send(foundArticles)
            }
            else{
                res.send(err)
            }
        })
    })
    .post((req, res) => {

        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
        newArticle.save((err) => {
            if (!err) {
                res.send("Successfully added a new article")
            } else {
                res.send(err)
            }
        })
    })
    .delete((req, res) => {
        Article.deleteMany((err) => {
            if (!err) {
                res.send("Successfully delete all articles")
            } else {
                res.send(err)
            }
        })
    });

app.route("/articles/:articleTitle")
    .get((req, res) => {
        const title = req.params.articleTitle
        Article.findOne({title: title}, (err, foundArticle) => {
            if (foundArticle) {
                res.send(foundArticle)
            } else {
                res.send("No article matching that article was found")
            }
        })
    })
    .put((req, res) => {
        const title = req.params.articleTitle;
        Article.updateOne(
            {title: title},
            {
                $set: {title: req.body.title, content: req.body.content},
            },
            {overwrite: true},
            (err) => {
                if(!err){
                    res.send("Successfully updated article")
                }
                else{
                    res.send(err)
                }
            }
        )
    })
    .patch((req, res) => {
        const title = req.params.articleTitle;
        Article.updateOne(
            {title : title},
            {$set: req.body},
            (err) => {
                if(!err){
                    res.send("Successfully updated article.")
                } else{
                    res.send(err)
                }
            }
        )
    })
    .delete((req, res) => {
        const title = req.params.articleTitle;
        Article.deleteOne({title: title}, (err) => {
            if (!err) {
                res.send("Successfully deleted the article")
            } else {
                res.send(err)
            }
        })
    });

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });

