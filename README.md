Kayla
=====

McKayla is not impressed

Why?
----
When it comes to analytics, often times people talk about sessions, users, page views, pages per session, session duration etc.

Well, McKayla is not impressed!

What?
----
Kayla is a simple library that helps you track time spent on actually **reading articles**, **listening to music**, and **watching videos** online.

How?
----
Include `kayla.js` in your page and start tracking:

    var myArticle = document.getElementById("myArticle")
        myAudio = document.getElementById("myAudio")
        myVideo = document.getElementById("myVideo")
    kayla.trackText(myArticle, "Super awesome article")
    kayla.trackAudio(myAudio, "Super awesome audio")
    kayla.trackVideo(myVideo, "Super awesome video")
