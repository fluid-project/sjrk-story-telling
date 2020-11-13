/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/main/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/main/LICENSE.txt
*/

// These eslint directives prevent the linter from complaining about the use of
// globals or arguments that will be prevent in CouchDB design doc functions
// such as views or validate_doc_update

"use strict";

require("infusion");
require("kettle");

require("fluid-couch-config");

// sets up the Storytelling Tool database migration using fluid-couch-config
fluid.defaults("sjrk.storyTelling.server.storiesDb", {
    gradeNames: ["fluid.couchConfig.pipeline.retrying"],
    couchOptions: {
        dbName: "stories"
    },
    listeners: {
        "onSuccess.logSuccess": "fluid.log(SUCCESS)",
        "onError.logError": "fluid.log({arguments}.0.message)"
    },
    dbDocuments: {
        "0e967c80-3aac-11e9-98be-695d9e3c45a1": {
            "type": "story",
            "value": {
                "id": "0e967c80-3aac-11e9-98be-695d9e3c45a1",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "title": "I learned to act and memorize my scripts",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": "What I learned from my teachers and classmates",
                        "blockType": "text",
                        "text": "In drama class my teacher teach us how to act and memorize our script . Well with the help of my classmates on my group I can enhance my acting skills, about emotions. My teacher gave a project about the influential drama teachers. Learning their styles not to do if your in the stage doing nothing just waiting for your time to come, that influential person help us not to use the same mistake as we did the time we perform in front of students and the people that watched the show."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "I am the Main Character",
                        "blockType": "text",
                        "text": "And the day comes and everything I learned I've use it. I tried hard to avoid having the important part. in the show where I perform in teachers and students are not so nerve wreaking but this one just my classmates and teacher but so much stress. I am the main character and i need to memorize so many line I need to memorize it at home, free time, lunch and well the period I need to memorize it. I need to ask my friend for the emotions I need to put in that scene. And the most hardest thing is being the bad girl there and at first I cant finish my lines and my classmate says i'm such a good girl. i will tell you the feeling is so new to me that's why. "
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "D'day",
                        "blockType": "text",
                        "text": "I will tell now is the day i'm doing it. the feeling of nervousness, the chill into my spine, the feeling of scared. memorizing my script all night long even day. looking like crazy memorizing a lines with emotion thank me that i'm with my friends less stress. I didn't look at the other performer because i'm memorizing my script. And the nervousness go in the flow the the first scene because i should be nervous in that scene. It came well and as the other putting myself in that place as the person who is doing the blind date. And the feeling that all of my blind dates are all crazy feeling tired of the craziness. And it ends well and all the chill, too much nervousness has gone and I can say no more im done."
                    }
                ],
                "author": "No. 4",
                "tags": [
                    "drama",
                    "memorizing script",
                    "acting"
                ]
            }
        },
        "151e03c0-879b-11e9-b178-a79380bdbe47": {
            "type": "story",
            "value": {
                "id": "151e03c0-879b-11e9-b178-a79380bdbe47",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "title": "My experiences camping",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "When I was 7 years old I went camping for the first time. It was spring, I was in a tent, and I was with my friends in a cub scout troop. Since then, I’ve loved camping. I go relatively often with my scout troop, and I have had many insane experiences. I have changed my style slightly since then. About 2 years ago, my friend and I tried a challenge we called the “no tent challenge.” It was camping, outside, but without a tent. We hung a rope between two trees and put a tarp over that tent style. Now, I almost never camp with a tent. I have made tons of different shelters, with different people, in different weather. I have slept in shelters with -45o C temperatures, with tornado winds blowing my shelter over 6 times throughout the night, and with foxes circling it (that was a really scary experience). During the tornado winds, I barely slept whatsoever, but the next night we fixed up out shelter, and I then slept extremely well. Now I always look forward to camping trips, and enjoy building new shelter ideas. \n"
                    }
                ],
                "author": "",
                "tags": [
                    ""
                ]
            }
        },
        "177fcea0-264d-11e9-a55a-317414fdb830": {
            "type": "story",
            "value": {
                "id": "177fcea0-264d-11e9-a55a-317414fdb830",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "title": "Breaking our assumptions",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "When I immigrated to Canada, I expected facing many challenges, but I never thought that technology would be one of them. Technology was part of every different task in this new country unlike what I was used to in my home country. Among all those experiences, there is one incident that haunted me for years and still makes me feel frustrated when using a piece of technology in front of a crowd. "
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "After a year of moving to Canada around 2005, I started going back to school to qualify my degree. In one of my first classes, we were assigned to present to the class about a particular topic. I used our family computer at home to prepare my presentation, burnet it on a CD and brought it to the class. With a quick look around me, I realized that no one is using a CD. Then, I noticed that everyone was using the teacher’s laptop to present. It was a LAPTOP and not a HOME COMPUTER! had never used a laptop before… feeling frustrated, I wondered where I should insert my CD. I quickly scanned the class to see if anyone was using a laptop and find out what I should do with my CD. I felt dumb, really really dumb… "
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "Finally, it was my turn to present. I walked to the front, anxiously sweating and frustrated. When I reached that laptop, I noticed it was different from my classmate's laptop that I had just decoded–it was a MacBook! There was no indication of a CD rom. I was stressed, I was looking at it but couldn’t process my thoughts. Those few seconds felt like years of embarrassment. I finally asked the teacher to help me insert the CD. During my presentation, I was only thinking about how to get that CD out of that machine. I couldn't see the eject button… at the end I had to ask for help again. "
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "",
                        "blockType": "image",
                        "mediaUrl": "./uploads/17787ba0-264d-11e9-a55a-317414fdb830.JPG",
                        "alternativeText": null,
                        "description": "An image of a MacBook Pro's CD slot and eject Button - This is a newer model than what was used in my class. ",
                        "fileDetails": {
                            "lastModified": 1549043825000,
                            "name": "MacBook Image.JPG",
                            "size": 1977371,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "Although the whole experience took less than 20 minutes, it had a lasting impact on me. After many years of experiencing similar challenges, I finally decided to deal with it. I realized that these incidents are not just my fault, they happen because of all the assumptions we make every day. In that class, the teacher had assumed everyone was comfortable using a MacBook. Now, I surrender right from the beginning to break those assumptions. I try to express what I need and ask for help. It is difficult and sometimes very stressful, but it immediately removes the pressure off of me and let me better focus on what needs to be done. "
                    }
                ],
                "author": "anonymous",
                "tags": [
                    "technology",
                    "challenges",
                    "presentation",
                    "fear"
                ]
            }
        },
        "18fb2950-3aac-11e9-98be-695d9e3c45a1": {
            "type": "story",
            "value": {
                "id": "18fb2950-3aac-11e9-98be-695d9e3c45a1",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "title": "Being Independent",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "Learning to be independent. I have learned to be independent on my school works and accepting any challenges or situations that involves my priorities. Giving enough time on my studies and my happiness. But sometimes asking someone's help if needed. Doing my responsibilities as much as possible. Like choosing books more often. When going home maybe begin to study.To make it easier to be independent is to be confident on what you do in life. Be more attentive in my works and learning to love on what I am doing. But sometimes we need exercise our body so I'm taking gym this semester for 45 min. of exercise and like 135 mins. of mental class.\n\n#Life Goals"
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "\nPag-aaral na maging malaya. Natutunan ko na maging malaya sa aking mga gawa sa paaralan at pagtanggap ng anumang mga hamon o sitwasyon na nagsasangkot sa aking mga priyoridad. Nagbibigay ng sapat na oras sa aking pag-aaral at kaligayahan ko. Ngunit kung minsan ay humihingi ng tulong ng isang tao kung kinakailangan. Paggawa ng aking mga responsibilidad hangga't maaari. Tulad ng pagpili ng mga aklat nang mas madalas. Kapag pumunta sa bahay ay maaaring magsimula sa pag-aaral. Upang gawing mas madali ang maging malaya ay upang maging tiwala sa kung ano ang iyong ginagawa sa buhay. Maging mas matulungin sa aking mga gawa at pag-aralang mahalin ang ginagawa ko. Ngunit kung minsan kailangan naming mag-ehersisyo ang aming katawan kaya kinukuha ko gym ang semestre na ito para sa 45 min. ng ehersisyo at tulad ng 135 min. ng mental na klase.\n\n#Life Goals"
                    }
                ],
                "author": "Myth",
                "tags": [
                    "Responsibilities"
                ]
            }
        },
        "1a202150-3aac-11e9-98be-695d9e3c45a1": {
            "type": "story",
            "value": {
                "id": "1a202150-3aac-11e9-98be-695d9e3c45a1",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "title": "How did I become confident",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": "",
                        "blockType": "text",
                        "text": "This is my story on how i become confident. Learning how to be confident is hard because, the people who is not used to being with people like me can get a hard time just by looking at the eyes of the people that I meet .The first time that I tried to get out of my shell, I feel so uncomfortable, It felt like i was on a big stage naked.\nAfter my first try I already gave up on trying again but then my mother know that there is something wrong about me, so my mother consult me and told me that i'm handsome and that really boost my confidence.In my second try, this time I tried another approach,I used the internet and watch videos about how to be confident and after hours of searching I found a channel that helped me,this channel really help me the most because, on how the owner of the channel is so confident and really know what he's talking about, the thing that i remember the most that this guy says is \"BE YOURSELF\",this words really struck me, when i stuck these words in my head it really felt good because, It made me realize that being confident is not following steps, its just being you.This means don't be like a guy/girl who doesn't have a real personality,your not like some people who just follow everyone's expectation because everyone is unique in their own way.Then when I become confident,sometimes I still feel awkward but now I say that its not like when I first started.This is my story on how i become confident.\n"
                    }
                ],
                "author": "Mr. Confident",
                "tags": [
                    "confident",
                    "how to relieve stress",
                    "be assure of yourself"
                ]
            }
        },
        "1d7623d0-28c9-11e9-98f6-71413982cc35": {
            "type": "story",
            "value": {
                "id": "1d7623d0-28c9-11e9-98f6-71413982cc35",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "title": "From Fear to Letting Go",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": "From Fear to Letting Go",
                        "blockType": "image",
                        "mediaUrl": "./uploads/1d6f1ef0-28c9-11e9-98f6-71413982cc35.jpeg",
                        "alternativeText": null,
                        "description": "My travels take me to many places that become part of who I am and what I aspire for in the future. Different connections with people who open up their lives and homes to me and all contribute to my sense of identity. Sometimes I reach a point of transformation and it requires a great sense of trust in the flow of life.",
                        "fileDetails": {
                            "lastModified": 1549317528970,
                            "lastModifiedDate": "2019-02-04T21:58:48.970Z",
                            "name": "73eae2b0-24b3-11e9-865f-b5fe084cdb92.jpeg",
                            "size": 2136739,
                            "type": "image/jpeg"
                        }
                    }
                ],
                "author": "Jennifer",
                "tags": [
                    "Flow"
                ]
            }
        },
        "22d85230-2a3b-11e9-98f6-71413982cc35": {
            "type": "story",
            "value": {
                "id": "22d85230-2a3b-11e9-98f6-71413982cc35",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "title": "My travelling",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "LEARNING EVERYTHING FOR THE FiRST TIME: My first time in airplane, I didn’t know how to wear a seatbelt and where it is.\nI looked near and behind me. I was afraid. Then my son showed me how to use it.\nAfter that I learned a new thing because another day if I get on the airplane \nI can do it myself And help someone who doesn’t know how use it.\nI feel happy and more confident. I want to learn more skills."
                    }
                ],
                "author": "",
                "tags": [
                    ""
                ]
            }
        },
        "236186b0-40f5-11e9-a3fc-117f000e6d4c": {
            "type": "story",
            "value": {
                "id": "236186b0-40f5-11e9-a3fc-117f000e6d4c",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "title": "About the lock ",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "when I came to Canada, I went to school. They gave us a lock. I did'n know how to use it . It was hard for me to use it because we did not use it in our country. I told my teacher I need help. She came and explained to me but I didn't understand english. There was one girl who spoke Arabic and she translated for me and it got better. "
                    }
                ],
                "author": "MZ",
                "tags": [
                    ""
                ]
            }
        },
        "2777d9f0-3aad-11e9-98be-695d9e3c45a1": {
            "type": "story",
            "value": {
                "id": "2777d9f0-3aad-11e9-98be-695d9e3c45a1",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "title": "Moving in a new country ",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": "What I learned here in Canada",
                        "blockType": "text",
                        "text": " Moving here in Canada was a very hard part for me because I need to get used to most of the things here. It was very difficult for me to get used to a new environment. I have to learn how to speak English confidently to the people around me. I have to get used to be able to communicate with people to have friends and other reasons such as ordering food and etc . At first, it was pretty hard but as days go by, and with practice I realized that I only need more confidence in talking with other people even though I make mistakes I can learn from it and improve my skills. I also learned how to be more responsible because back at home we were depending on other people while here I have to make my own decisions. I learned how to manage my time wisely like waking up to school and etc . Another experience that was fun for me was learning how to ride train and buses, back at my hometown there was no trains we only use jeeps and taxis for transportation. It was fun for me to learn where to ride and stop on a place to go where I want to go. I also experienced to present on a stage because last semester I took music and it was difficult at first for me but overtime I got used to it and saw the performance as a challenge and it was a fun experience for me because I learned how to play guitar and read music notes, it was a very memorable experience for me."
                    }
                ],
                "author": "Anonymous 16",
                "tags": [
                    "Riding a bus",
                    "Learning a new language",
                    "Riding a bus",
                    "New to a country"
                ]
            }
        },
        "2931a1f0-879b-11e9-b178-a79380bdbe47": {
            "type": "story",
            "value": {
                "id": "2931a1f0-879b-11e9-b178-a79380bdbe47",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "title": "The first day",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "I was laying in my bed, not quite ready to get up yet. Not wanting to get up. It was September 4th, 7:00 am and the first day of grade 6 was starting in 2 hours. But I wasn’t in my sender school. I was in the gifted program at a new school. I thought about how much I missed my friends at my old school and how nervous I was. Would the gifted program be a million times harder? Would we have homework every single day?? Would I know anyone??? I was already dreading school, and it hasn’t even started yet.\n\nWhen I arrived at the new school, I realized it wouldn’t be much different from my old school. I met lots of people in my class who were also new and I felt a bit more at ease. There weren’t many differences, and I wasn’t nervous anymore. To this day, I’m still in the gifted program and I’m happy with my class."
                    }
                ],
                "author": "Gelato",
                "tags": [
                    ""
                ]
            }
        },
        "2ad53090-3abf-11e9-98be-695d9e3c45a1": {
            "type": "story",
            "value": {
                "id": "2ad53090-3abf-11e9-98be-695d9e3c45a1",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "title": "my view of canada",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "This is am first time come to canada, I like this country because there have great education, health care, transportation system. And, most of the people are kind, I remember when I first time use the TTC, I lost and most of the TTC officer will listen to me patiently and tell me where should I go. This is a great experience that tell me how canadian is. \nAlso, I was a ESL student, but after make friend, read many news report and watch english news in youtube. My english have a great impact, I can read news article easier than before and I think some of the left gone way too far in some of their policy. But, anyway that is just my opinion. I think if I keep doing that I can improve my knowledge, and that is a good thing for me. "
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": null
                    }
                ],
                "author": "abc",
                "tags": [
                    ""
                ]
            }
        },
        "2ca452c0-2a8e-11e9-98f6-71413982cc35": {
            "type": "story",
            "value": {
                "id": "2ca452c0-2a8e-11e9-98f6-71413982cc35",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "title": "My favorite things.",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": "My favorite things.",
                        "blockType": "text",
                        "text": "I would like to write about my story. This is a picture of my Cake. I baked it. I really interested of baking. When I bake something my feel be very enjoyable. Usually I bake cakes and cookies, any desserts. When I baking while I listen to music and singing song. It’s to be really wonderful time for me.\n"
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl": "./uploads/2ca0a940-2a8e-11e9-98f6-71413982cc35.jpeg",
                        "alternativeText": null,
                        "description": null,
                        "fileDetails": {
                            "lastModified": 1549510372000,
                            "name": "8FE228DF-9FD8-4FAD-9454-C5FCFCDD849F.jpeg",
                            "size": 290355,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl": "./uploads/2ca1e1c0-2a8e-11e9-98f6-71413982cc35.jpeg",
                        "alternativeText": null,
                        "description": null,
                        "fileDetails": {
                            "lastModified": 1549510840000,
                            "name": "57C5E49E-C0B6-4532-BB2E-26973F679F04.jpeg",
                            "size": 257124,
                            "type": "image/jpeg"
                        }
                    }
                ],
                "author": "Mubina",
                "tags": [
                    ""
                ]
            }
        },
        "2d8bbdf0-5caa-11ea-a24f-b72ef3f26124": {
            "type": "story",
            "value": {
                "id": "2d8bbdf0-5caa-11ea-a24f-b72ef3f26124",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "content": [
                    {
                        "authoringEnabled": true,
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "I have a computer supplied by the school board. It has been broken since last year so I sometimes can’t do my work. My mom has been trying to get me to take notes in history class so the other day I pulled out my phone and opened google keep. My mom showed me the app so I tried it. It was working pretty good and I was taking notes. My history teacher came around and pointed to my paper on the desk and said that the pen and paper were for note taking, not my phone and I had to put my phone away. He doesn’t understand. \n"
                    }
                ],
                "title": "Taking notes",
                "author": "",
                "tags": []
            }
        },
        "2dbb8f80-879e-11e9-b178-a79380bdbe47": {
            "type": "story",
            "value": {
                "id": "2dbb8f80-879e-11e9-b178-a79380bdbe47",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "title": "Global warming",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "\nGlobal warming is when the carbon dioxide (otherwise known as CO2) is damaging the ozone layer. The ozone layer protects us from the sun’s rays, so since the ozone layer is damaged, the sun’s rays are making the earth hotter. This is causing icebergs to melt and water level to rise, causing floods. \n\nGlobal warming makes me mad now because a lot of people know about global warming, believe in global warming, say they will do something to help, and they still don’t do anything. Also, you shouldn’t use air conditioning. You should really use a fan or water, because air conditioning, although intended to make you cool, actually is one of the things that contributes a lot to the global warming problem. I think people should think of the long term effects over the short term effects!\n\nGlobal warming is happening faster then ever. Some places are in danger of flooding. Also, a lot of animals are dying, including polar bears and seals! If global warming keeps going, at this rate, the earth is going to be inhabitable in around a single generation. \nFor the people who say global warming doesn’t exist, there is a lot of proof. Giant icebergs have been melting. Also, the global temperature has increased by at least 1 °C. That may not seem like a lot, but I think that the amount of carbon dioxide (a chemical that damages the ozone layer (ozone layer protects us from the sun’s rays)) is increasing in amount and therefore the earth is getting hotter and the icebergs are melting. \n \nAlso, because of global warming, there have been a lot more natural disasters. I have experienced a flood because of that. Tornados and a lot of other natural disasters also increase in number now!!!!!!!!!!!!!!\n\nEveryone has a part they need to do to stop global warming. For example, people need to take a bike instead of a car, and even if they can’t they should take public transit because there are a lot of people there already. You can also stop using heaters as often and actually just wear a sweater instead and during bedtime just wear multiple layers of sheets. \nEven if you can’t do a lot, you can still spread the information in try to encourage other people to help out. The future is not looking so great, and it won’t be great unless we make a difference. But together we can save the earth! \n\nP.S. One person can make a difference!!!! \n"
                    }
                ],
                "author": "Enviralment",
                "tags": [
                    ""
                ]
            }
        },
        "2fbf9d20-2a39-11e9-98f6-71413982cc35": {
            "type": "story",
            "value": {
                "id": "2fbf9d20-2a39-11e9-98f6-71413982cc35",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "title": "How My wife and I decided to move to Canada",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "I would like to tell a story that how My wife and I decided to move to Canada.\n After I graduated from university in China,I found a relatively good job and got married with My wife.After three years hard work,We bought an apartment in My hometown and got a higher position in My company,everything seemed good that time.\n However,things were changing! In October,2016,My wife and I traveled to Europe in our honeymoon.It was during that time that We found The world outside was colorful, and there were different people and different culture there. We realized that there was a lot of things We should experience,instead of the repeated everyday life in My homecity."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl": "./uploads/2fbd7a40-2a39-11e9-98f6-71413982cc35.jpeg",
                        "alternativeText": null,
                        "description": "Our trip to Europe",
                        "fileDetails": {
                            "lastModified": 1549454423000,
                            "name": "33BA769E-814A-4384-B7C1-64EFBA3C88A5.jpeg",
                            "size": 107135,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "After struggling for a long time, We finally made a decision that We would give up everything in my hometown and move to a new country-Canada.\n We knew that It was difficult to restart a life,but It is worthy experiencing a brand new life,which We thought was exciting!\n After arriving in Canada in August,2018, It took a long time for us to settle down. Language problems,low credit,financial problems and new social systems all troubled us seriously.However,We do not fear anything,because We believe that time will help us get better and better!"
                    }
                ],
                "author": "ZD",
                "tags": [
                    ""
                ]
            }
        },
        "30af2fb0-3ac0-11e9-98be-695d9e3c45a1": {
            "type": "story",
            "value": {
                "id": "30af2fb0-3ac0-11e9-98be-695d9e3c45a1",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "title": "My experience about learning language",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "This is my story about learning a skill. Language is difficult for me. When I first came to this country. I was uncomfortable in here entirely. Language was a big problem for me. I didn't understand what people said and didn't know how to communicate with others. English was as the second language in China, we just learnt some grammar in the school and didn't speak English in normal life. After a period of time, I went to the school to study. It was strange and felt very nervous. Fortunately, I met some people, they knew I was new here, they were greeting with me passionately and would like to help me. I made with friends with them. When I had problems in language, they were very kind to help me. I learnt some about the language when they explanation with me. During that time, I didn't understand the courses entirely but I had to learn. In this environment, I had to learn the language. Language was most important and necessary to master. In the school, I improved my English skills slowly because friends' help and the environment factor. "
                    }
                ],
                "author": "Ynnah",
                "tags": [
                    "learn the Language skills"
                ]
            }
        },
        "35b5a520-40f6-11e9-a3fc-117f000e6d4c": {
            "type": "story",
            "value": {
                "id": "35b5a520-40f6-11e9-a3fc-117f000e6d4c",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "title": "My first day in Canada school ",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "When I came to Canada, I did not know how to speak english, the only think I knew it was to say hello and how are you? and I remember, in my first school in my first day, my mom was said when somebody said what is your name, you answer my name is Mariana and you? and then I went to in school , when I went to school everything was different from my country school or in Brazil in that school had lockers the room was different and I saw a lot of things and I was a little nervous but people came to me and said hi to me and then I went to the officer and they showed me somebody who spoke the same language like me and this made me happy and I was thinking nobody spoke the same language like me and this made me so happy and I went to the class and same thing did not it was all most everybody was from others country. so they can understand how was to learn others language and I now make new friends and I have lot of fun in that school."
                    }
                ],
                "author": "M",
                "tags": [
                    ""
                ]
            }
        },
        "3c9f3210-3aad-11e9-98be-695d9e3c45a1": {
            "type": "story",
            "value": {
                "id": "3c9f3210-3aad-11e9-98be-695d9e3c45a1",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "title": "How to ice skate",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "I came here in Canada on 2016 and after 1 week i went to school and they are speaking English and i wasn't talking to anyone. After 1 month i can speak a little bit English and and started to make friends. My cousin invited me to ice skating and that was my first time to ice skate and i thought it was easy to ice skate because it looks easy and when i stepped on the ice with my skate shoes i slipped and my cousin helped me how to skate. And after 1 year I Learned and became good at it and break dancing on the ice. I learned how to skate because ice skating is fun, enjoying and make friends. Ice skating is not easy to learn if your afraid and if your not afraid to fall you gonna learn fast. Ice skating is nice when your free styling on the ice and you can break dance as well. "
                    }
                ],
                "author": "Kian",
                "tags": [
                    "ice skate"
                ]
            }
        },
        "3d2afa40-2a39-11e9-98f6-71413982cc35": {
            "type": "story",
            "value": {
                "id": "3d2afa40-2a39-11e9-98f6-71413982cc35",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "title": "",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "My story is about moving from Jordan to Canada \nIn Jordan I had money problems. \nAll people from Syria can't to go work in Jordan.\nWhen l come to Canada l said l want to go back to Jordan.\nTwo months later I didn't want to go back to Jordan anymore!\nAn now l am happy because now I can speak English and I have good friends. \n"
                    }
                ],
                "author": "",
                "tags": [
                    ""
                ]
            }
        },
        "44165be0-3aad-11e9-98be-695d9e3c45a1": {
            "type": "story",
            "value": {
                "id": "44165be0-3aad-11e9-98be-695d9e3c45a1",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "title": "How I learned on how to use the bus",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "I learned how to use the bus and the train . At first it was hard for me because I didn't always use the bus when I was a kid so I didn't know how to use or ride the train. When I heard that I need to use the bus in order to go to school , I was so nervous because I have never ridden a bus or train ever in my life unsupervised . But good thing I had friends teaching me how to use the bus or the train. At first , learning on how to use the bus was very hard and scary for me because I thought I'm gonna get lost not knowing how to go home. Luckily my friends thought me how to use the bus. Now I know how to ride the bus and the train so now I can go to many places whenever I want."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "My first experience on using the bus myself is when the school had a late start schedule. My friend went to Philippines in order to bond with her family so I was alone at that time . I was so nervous because this is was my first time using the bus by myself. But luckily, I had one other friend who also taught me on how to use the bus but we never use the same bus together , and so I asked him. He gave me directions on how to use the bus in order to go to school . It was 9:30 AM at that time due to the late start. Thanks to him I was able to go to school at the right time ."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "For my recommendation to those who are scared of trying new things, you should have the courage to try new things in order to accomplish it because its not that hard if you really try it . Because the first time I used the bus was hard but if you get used to it it will turn out to be easy and actually not hard. And yes sometimes it can be challenging depending on the situations but you have to fight in order to accomplish it."
                    }
                ],
                "author": "",
                "tags": [
                    ""
                ]
            }
        },
        "57490f70-879a-11e9-b178-a79380bdbe47": {
            "type": "story",
            "value": {
                "id": "57490f70-879a-11e9-b178-a79380bdbe47",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "title": "Brothers",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "Brothers are interesting. It’s like they have two sides, they are either nice and helpful, or they are moody and mischievous. And I have two of them, so you can imagine what life is like. Sometimes they can make me really, really mad, but at least I have someone to play with, and someone who is there for me. Both of my brothers are younger than me, and one of them is a baby, wherever he goes there is disaster. The pros of having a brother- they are comforting, you have someone to play with, they can be amusing, they stand up for you (sometimes), and the cons of having a brother- they can be really annoying, they can be abnormally mischievous, they can be really mean, and they can be tattletales. I want to have a good relationship with my brothers when I am younger so when I am older I will have a good relationship with them then too. Before my second brother was born I was hoping he was going to be a girl. But when I found out that he was a boy I was kind of disappointed, but now I am happy that he is my brother and not my sister (FYI- I don’t have a sister). My 8 year old brother always blames me for things, but in the end I am happy that he is my brother and I don’t care that he blames me for every little thing. There was one time where I really freaked my brother out. Like, I scared his socks off. But I didn’t think it would really do anything. What I did is I hid under his covers on his bed and I waited for him to enter his room, when he did I popped up from the covers and said ‘boo!’ But the lights were off and he thought that I was in my room. So he screamed and started crying, my parents ran to his room and automatically knew that I had scared him. I was really in trouble. But I felt really, really, really bad about it, and now that I look back on it I regret it so, so much. I just thought that he would take it as a joke, but he didn’t. I think that brothers are awesome and if you have one, you are very lucky. I hope that my brothers are always there for me, because I will always be there for them."
                    }
                ],
                "author": "Anonymous",
                "tags": [
                    ""
                ]
            }
        },
        "6028a360-3aad-11e9-98be-695d9e3c45a1": {
            "type": "story",
            "value": {
                "id": "6028a360-3aad-11e9-98be-695d9e3c45a1",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "title": "Learning to drive a car",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "I learned to drive a car. I chose to this to tell because It was memorable and I can't forget those memories with my dad. My dad and I was on a car. He's teaching me to drive a car. On that time I realized that driving a is not easy. When my sister is driving I always get bored because her speed is 40 kph all the time. I always tease her because I don't like when the driver is driving slow and steady. At first time, I wasn't expected that driving is way too hard than driving a bicycle. I thought driving a car is easy but suddenly when my turn or when my dad declared that I'm next to my sister, I get nervous. "
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "Driving a car for me is very difficult because my feet on that time can't reach the fuel guage. I remember on that time my dad was giving up on me because I had a hard time learning. Were almost get crash and my dad was nervous too. I wasn't really expected that driving a car is not easy. We took 2 to 5 hours a day just to teach me, and I really appreciated those effort of my dad. My dad really don't gave up on me but he motivated me that I can overcome my driving lesson. "
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "After 3 months, I can now drive a car without my dad. Because of him I now can drive independently. The most difficult I've experienced is driving, but now I'm now good at driving and I can now drive at highways"
                    }
                ],
                "author": "Jan Carlo Torres",
                "tags": [
                    "hardworks"
                ]
            }
        },
        "63801940-2a3a-11e9-98f6-71413982cc35": {
            "type": "story",
            "value": {
                "id": "63801940-2a3a-11e9-98f6-71413982cc35",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "title": "About myself ",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "They’re three things important to me on my life."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl": "./uploads/63787820-2a3a-11e9-98f6-71413982cc35.jpg",
                        "alternativeText": null,
                        "description": null,
                        "fileDetails": {
                            "lastModified": 1549474773000,
                            "name": "image.jpg",
                            "size": 632644,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "The coins mean many things to me it from my country. It’s one thing I have from Syria.i will save that forever I can’t forget anything from Syria."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl": "./uploads/63787820-2a3a-11e9-98f6-71413982cc35.jpg",
                        "alternativeText": null,
                        "description": null,
                        "fileDetails": {
                            "lastModified": 1549475326000,
                            "name": "image.jpg",
                            "size": 1825049,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "The mosque for Muslim people is more than a place of worship. We use the mosque for study , business and activities. We use it for a community centre. The mosque welcomes all people who respect the places."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "I will save all those things forever. I learned a lot of things from my life and more skills to work with people. I hope to not lose anything from my life."
                    }
                ],
                "author": "",
                "tags": [
                    ""
                ]
            }
        },
        "702789c0-473c-11e9-a3fc-117f000e6d4c": {
            "type": "story",
            "value": {
                "id": "702789c0-473c-11e9-a3fc-117f000e6d4c",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "title": "",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": "Deaf Education",
                        "blockType": "text",
                        "text": "Hi, I thought I would tell my story as a hearing person on how I learned ASL and Deaf Culture.\n\nI started volunteering with the deaf at St. Francis Deaf Community and Holy Name Church in 1970. I remember that I would attend the Mass on Sunday morning and then join in for Tea and Coffee after. I knew the alphabet from being a young girl and having one deaf girl who lived on my street that I would go and visit and play with. At that time the alphabet was all we used and oral communication. When I sat with the Deaf having Tea and Coffee they were a little hesitant to speak or teach me signs as I was a young girl of 16. the more I kept coming to Mass for the Deaf and Social events slowly they accepted me and communicated with me. \n\n At the same time I was a volunteer with the children in teaching Religion. That had to be done Orally as per the government regulations. During this time a met a young deaf women who loved music and wanted to learn the words etc to songs she had heard / felt the music for. I became friends with her and after classes on Saturday afternoons with the children, would go to her place and write the words to the songs and then try to sign them or learn the signs. This was very helpful to my learning ASL as it made my signing a little smoother.\n\nIn the early 1970 's there was no formal Sign Language Courses so you learned from individuals and being involved. As time went on I became very fluent in signs and when there was any course I could attends to develop my education, I tried to attend. \nLearning ASL is a continuous journey and I thank the Deaf for this . I meet many Deaf from all over Canada and the USA which has helped me so much. \n\nI now consider the Deaf as part of my Family and THANK them for allowing me to be part of their world."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl": null,
                        "alternativeText": null,
                        "description": null,
                        "fileDetails": null
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "mediaUrl": null,
                        "alternativeText": null,
                        "description": null,
                        "blockType": "audio",
                        "fileDetails": null
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "mediaUrl": null,
                        "alternativeText": null,
                        "description": null,
                        "blockType": "video",
                        "fileDetails": null
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": null
                    }
                ],
                "author": "Carol Stokes",
                "tags": [
                    ""
                ]
            }
        },
        "71080660-40f4-11e9-a3fc-117f000e6d4c": {
            "type": "story",
            "value": {
                "id": "71080660-40f4-11e9-a3fc-117f000e6d4c",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "title": "My story is about cooking ",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "I know how to cook. my Mom teach me how to cook. I am cooking for my self. and also I like cooking. one time I cooked pasta that was very spicy . and no body eat yet. I told them please eat it. and they are said we will eat this. but this is very spicy. and then i was so sad for that. and when I am cooking i fell so good and nice. because I like cooking. and become i need to learn more about cooking . like I need to cook pizza soup rice and kabab. "
                    }
                ],
                "author": "S k",
                "tags": [
                    ""
                ]
            }
        },
        "73e65960-3aad-11e9-98be-695d9e3c45a1": {
            "type": "story",
            "value": {
                "id": "73e65960-3aad-11e9-98be-695d9e3c45a1",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "title": "How to ice skate",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "I came here in Canada on 2016 and after 1 week i went to school and they are speaking English and i wasn't talking to anyone. After 1 month i can speak a little bit English and and started to make friends. My cousin invited me to ice skating and that was my first time to ice skate and i thought it was easy to ice skate because it looks easy and when i stepped on the ice with my skate shoes i slipped and my cousin helped me how to skate. And after 1 year I Learned and became good at it and break dancing on the ice. I learned how to skate because ice skating is fun, enjoying and make friends. Ice skating is not easy to learn if your afraid and if your not afraid to fall you gonna learn fast. Ice skating is nice when your free styling on the ice and you can break dance as well. "
                    }
                ],
                "author": "Silent k soul",
                "tags": [
                    "ice skate"
                ]
            }
        },
        "757d01a0-879e-11e9-b178-a79380bdbe47": {
            "type": "story",
            "value": {
                "id": "757d01a0-879e-11e9-b178-a79380bdbe47",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "title": "The Happiest Day of my Life",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": "The happiest day of my life",
                        "blockType": "text",
                        "text": "One day in March 2017 it was a weekend when me and my mom where really bored so I asked her if she wanted to get a pet. She said yes right away and that was one of the happiest moments of my life. we went straight to the pet store, when we got there the petsmart assistant said the most ideal pet for our house would be a Guinea pig, the next day me my mom and my brother did some research about what they eat and what they like to do. It was about 5 days later when my mom said we were ready to get a pet. Me and my family drove back to the store only to find out that you needed to get two guinea pigs, because they are social animals which means they need a partner. I was feeling sad because we might not get them if there are two but if we did get them I would be even happier. A few moments later my mom agreed to getting pets so I yelled yay because that was the happiest day of my life. To this day I am still happy every time I get home because I am greeted by my two guinea pigs named Luna and Scruffy."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl": "./uploads/75786dc0-879e-11e9-b178-a79380bdbe47.jpeg",
                        "alternativeText": null,
                        "description": null,
                        "fileDetails": {
                            "lastModified": 1559744930418,
                            "lastModifiedDate": "2019-06-05T14:28:50.418Z",
                            "name": "03CDDA19-5E44-4DC5-A3B8-18FD3FD8236A.jpeg",
                            "size": 1817378,
                            "type": "image/jpeg"
                        }
                    }
                ],
                "author": "FaZe_Tfue",
                "tags": [
                    "My new pet"
                ]
            }
        },
        "93a03290-2a3a-11e9-98f6-71413982cc35": {
            "type": "story",
            "value": {
                "id": "93a03290-2a3a-11e9-98f6-71413982cc35",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "title": "Memories of my childhood ",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "I would like to write about my story. This is a picture of me with my nephew when I was a little baby. \nI have only two pictures from my childhood they are valuable to me because they are all the pictures I have. The first picture was in Iraq I was living with my family before the war it was a safe, free country and everything was easy. The second picture was taken before my family and I visited Turkey. \nIn Canada my new life is great, I think working with people and respecting each other is great. Also Canada taught me a lot of things. I’m really very grateful to Canada. I hope that days of my childhood will return."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": " This is picture of me when I was in my home country ",
                        "blockType": "image",
                        "mediaUrl": "./uploads/93978000-2a3a-11e9-98f6-71413982cc35.jpeg",
                        "alternativeText": null,
                        "description": null,
                        "fileDetails": {
                            "lastModified": 1549476104000,
                            "name": "CB8EA97A-95B5-49BC-8DF8-16D9357EDD58.jpeg",
                            "size": 3133323,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "This is a picture with my nephew ",
                        "blockType": "image",
                        "mediaUrl": "./uploads/939e5dd0-2a3a-11e9-98f6-71413982cc35.jpeg",
                        "alternativeText": null,
                        "description": null,
                        "fileDetails": {
                            "lastModified": 1549476208000,
                            "name": "459D658F-458B-43BC-BE7D-A388F264A130.jpeg",
                            "size": 554767,
                            "type": "image/jpeg"
                        }
                    }
                ],
                "author": "Ghazwan ",
                "tags": [
                    ""
                ]
            }
        },
        "a1290a10-40f4-11e9-a3fc-117f000e6d4c": {
            "type": "story",
            "value": {
                "id": "a1290a10-40f4-11e9-a3fc-117f000e6d4c",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "title": "learning how to use computer",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "The first time I saw a computer I didn't know everything about it. The teacher helped me to use the computer. I practiced and after 2 years I learned how to use the computer at school. \n\n\n "
                    }
                ],
                "author": "king",
                "tags": [
                    ""
                ]
            }
        },
        "a177e2a0-879b-11e9-b178-a79380bdbe47": {
            "type": "story",
            "value": {
                "id": "a177e2a0-879b-11e9-b178-a79380bdbe47",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "title": "The fire!",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "When I was in grade 4, I really needed to go to washroom so I went. When I entered I discovered a fire! Apparently the hand dryer had exploded! I was so scared because I didn't want to be engulfed in flames and burn. I felt like I couldn't move but then I shook my head and immediately ran out of the washroom. I told the nearest teacher. The teacher went inside and quickly put out the fire. In the end I was happy that I did the right thing and tell a teacher."
                    }
                ],
                "author": "",
                "tags": [
                    ""
                ]
            }
        },
        "a3a87710-40f6-11e9-a3fc-117f000e6d4c": {
            "type": "story",
            "value": {
                "id": "a3a87710-40f6-11e9-a3fc-117f000e6d4c",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "title": "little girl",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "mediaUrl": "./uploads/a3a65430-40f6-11e9-a3fc-117f000e6d4c.m4a",
                        "alternativeText": null,
                        "description": null,
                        "blockType": "audio",
                        "fileDetails": {
                            "lastModified": 1551974666000,
                            "lastModifiedDate": "2019-03-07T16:04:26.000Z",
                            "name": "New Recording 5.m4a",
                            "size": 404197,
                            "type": "audio/x-m4a"
                        }
                    }
                ],
                "author": "m c",
                "tags": [
                    ""
                ]
            }
        },
        "a51dec50-28c9-11e9-98f6-71413982cc35": {
            "type": "story",
            "value": {
                "id": "a51dec50-28c9-11e9-98f6-71413982cc35",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "title": "LOVE IS LOVE 7",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": "LOVE IS LOVE 7",
                        "blockType": "image",
                        "mediaUrl": "./uploads/a51c3ea0-28c9-11e9-98f6-71413982cc35.JPG",
                        "alternativeText": "Friendship, true love!",
                        "description": "This picture represents the friendship that I have with my friends and my two sisters. On this day in 2011, we went from Quebec city to Montreal city to do a fundraising in Montreal subways stations for the children of Gaza, the Rohingya community and the Syrian refugees. All those smiles and energy represent our personalities and the love that we share with everyone!",
                        "fileDetails": {
                            "lastModified": 1549317656205,
                            "lastModifiedDate": "2019-02-04T22:00:56.205Z",
                            "name": "45c6f210-24b4-11e9-865f-b5fe084cdb92.JPG",
                            "size": 460277,
                            "type": "image/jpeg"
                        }
                    }
                ],
                "author": "",
                "tags": [
                    "friendship",
                    "love",
                    "sharing"
                ]
            }
        },
        "a62af8c0-2a38-11e9-98f6-71413982cc35": {
            "type": "story",
            "value": {
                "id": "a62af8c0-2a38-11e9-98f6-71413982cc35",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "title": "My hopes ",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": "My goals,hopes,problems etc.",
                        "blockType": "text",
                        "text": "My story begins when I was younger 18 years old. Years ago when I was younger, I did not have problems about life and future. I am getting grown up and my problems grow up with me. \n\nWhen I was 19 years old, I came to Canada. I have to choose my way and I chose. I will learn English and go to school. \n\nI had chosen my way but there are always ways in the life. Never it will finish. \n\nNow,I am 20 years old. I want a good life and job. I need hard work for these goals and of course luck. \n\nI should be hopeful for my future. I don’t know for now, what can I do for these goals but I have thoughts and hope for the future. "
                    }
                ],
                "author": "",
                "tags": [
                    ""
                ]
            }
        },
        "a973a5f0-40f3-11e9-a3fc-117f000e6d4c": {
            "type": "story",
            "value": {
                "id": "a973a5f0-40f3-11e9-a3fc-117f000e6d4c",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "title": "learning how to cook",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "My first day of cooking was at my house. I was so nervous in the kitchen. I thought I was gonna make a fire, a big fire. But after two days I learned because my uncle and my mom helped me how to cook and the next day my family tried to eat my food and they said the food was very good. I was proud of myself."
                    }
                ],
                "author": "EC",
                "tags": [
                    ""
                ]
            }
        },
        "ac70af10-3aad-11e9-98be-695d9e3c45a1": {
            "type": "story",
            "value": {
                "id": "ac70af10-3aad-11e9-98be-695d9e3c45a1",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "title": "the day I learned how to speak another language ",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "For almost five years I've been living in Canada and it feels like an adventure . I've been to many places and learned so much things beyond my expectation. but in those years it wasn't all good ,there was also a challenge that came with it and this is how my story begins . When I first came to this country the only thing on my mind was getting good grades till the day a teacher came to my classroom and started to speak in another language . At first I was curios , what kind of language is the teacher speaking. Someone told me that we were learning another language .I was freaked out and felt like i was done for not because i got a D in my first day learning another language it is because i never thought i would learn another language . Because of this i lost focus on my work and i felt like giving up . I told my mom about this and she answered \"what ever is putting you down and felt like giving up don't hesitate to stand back up \" . Ever since that day i had courage and reason to stand back up for me to learn and understand this concept . A year has past i finally am able to catch up and continue what i started. this is my story:)"
                    }
                ],
                "author": "Ridge Angelo Facun",
                "tags": [
                    ""
                ]
            }
        },
        "acf01b20-40f6-11e9-a3fc-117f000e6d4c": {
            "type": "story",
            "value": {
                "id": "acf01b20-40f6-11e9-a3fc-117f000e6d4c",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "title": "اول يوم بل باص",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "اول يوم اجيت علئ كندا كنت ما اعرف استعمل الباص ورحت مرا علمدرسة وضعت وبعدين تعلمت كيف استعمل الباص وهلق صرات اعرف كيف استعمل الباص واروح وين ما بدي وانبصطت كتير وهلق اتمنه اني اتعلم الطرقات عشان روح وين ما بدي واتمنه الكل يتعلم لانو ازاما يعرفو ما راح يقدرو يعملو الي بدهم ايه "
                    }
                ],
                "author": "YE",
                "tags": [
                    "باص"
                ]
            }
        },
        "b1374550-2a3a-11e9-98f6-71413982cc35": {
            "type": "story",
            "value": {
                "id": "b1374550-2a3a-11e9-98f6-71413982cc35",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "title": "",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "I am from Ethiophia . In 2014 I laft to Kenya Kakuma camp. I was working in a business for 5 years. After those years, I left to Canada so i like canada. I can change my life now. "
                    }
                ],
                "author": "",
                "tags": [
                    ""
                ]
            }
        },
        "b2b3e510-40f5-11e9-a3fc-117f000e6d4c": {
            "type": "story",
            "value": {
                "id": "b2b3e510-40f5-11e9-a3fc-117f000e6d4c",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "title": "My story is about cleaning house",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "I know how to clean house. When my mom she went to the mall for shopping and I was at home a lone and I clean my house and my room kitchen. I wash dishes. when my mom she came to home. she was so happy for that. because I cleaned house.and she kiss me. and she very happy.and I was so tired."
                    }
                ],
                "author": "k k",
                "tags": [
                    ""
                ]
            }
        },
        "bdd42440-40f6-11e9-a3fc-117f000e6d4c": {
            "type": "story",
            "value": {
                "id": "bdd42440-40f6-11e9-a3fc-117f000e6d4c",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "title": "مدرسة",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "نا تعلمت احكي انجليزي لانو ماكنت اعرف من قبل بس كانت صعبا كتير لانو ماكنت احكي ولا اقراء بس كانت كتير صعبا علي بس انا تعلمت بكندا كتير اشياء اول شي تعلمت احكي انجليزي وتاني شي ماكنت اعرف عل كنبيوتر بعدين تعلمت على وصرات اعرف استعمل الكنبيوتر وكمان انا ماكنت اعرف استعمال الباص بعدين صرات اروح عل مدرسه بل باص وبعدين صرت اعرف استعمل الباص"
                    }
                ],
                "author": "MA",
                "tags": [
                    ""
                ]
            }
        },
        "c35ae7b0-3abf-11e9-98be-695d9e3c45a1": {
            "type": "story",
            "value": {
                "id": "c35ae7b0-3abf-11e9-98be-695d9e3c45a1",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "title": "Learned how to play video games",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": "",
                        "blockType": "text",
                        "text": "In my whole life, I have learned so many things. For me I think learned how to play games is the most easy. My first time playing video game was when I was 12. before that my life was all about school. which it makes me so boring , so I decided to learned new things, which was video games. when I first played it, I found it more fun than studying. For one reason was because it has so many different types of games. The games also separate the level differently. It had easy, intermediate and hard mode, but later on I was so in love with it, my school marks had been dropped because of that. My parent started to forced me managed the time. After it, I tried to play less, but later on I was out of it, cause I can't find the passion when I first played it. so I learned how to play video games, also known how can managed the time and control time. It was a big lesson for me. I still play video games right now. "
                    }
                ],
                "author": "zed",
                "tags": [
                    "learning games/ managed time"
                ]
            }
        },
        "c75baf70-3abf-11e9-98be-695d9e3c45a1": {
            "type": "story",
            "value": {
                "id": "c75baf70-3abf-11e9-98be-695d9e3c45a1",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "title": "My second language",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "The first time I learned English is in China. English is a very hard language. I was learning about some basic English then I came to Canada. At first I was so scared and nervous ,because it's the first time I go to other country. The first day I went to school in Canada. I was so nervous,because I don't know how to communicate with other people. When I go to the class i felt nervous and scared. I don't know what other people saying. I can't communicate with other people,that the effect me to learn English. I knew some friends in school, they help me a lot. When I don't know something or some words is hard for me they always help me to understand. Now, I start to understand what they are saying and try to communicate with them."
                    }
                ],
                "author": "Yasuo",
                "tags": [
                    "learn English"
                ]
            }
        },
        "c8c4c740-3abd-11e9-98be-695d9e3c45a1": {
            "type": "story",
            "value": {
                "id": "c8c4c740-3abd-11e9-98be-695d9e3c45a1",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "title": "Bad friends around you - suggestions",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": "",
                        "blockType": "text",
                        "text": "Avoiding bad friends around you is a skill that you have to have in your daily life."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "Why do you need to avoid bad friends around you? Cause there are some bad thinkings and bad habits, and some of them can't figure out or don't want to listen to others' suggestions about them. If you stay with them day by day, you will kind of following their habits, their bad speakings, and at that time it is too late for you to change your habits, you would be used to it."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "There are some people showing themselves, speaking loudly at the public places, saying something bad, that will give you the first feelings about them, remember them and try not to have an intersection with them. "
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "There are also some people act great at first, but some small habits or actions in daily life will destroy the good feelings that you have built for them. Then just keep away from them."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "But, the things up top is based on you don't have a strong character on leading your friends. If you don't want to change your mind and you do have the skills that can change your friends from bad to good, then do it. "
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "Life is a strange thing and full of regrets, but do not regret staying away from your bad friends. If you have something concerned about with your friends or worried about if your friends are good or not, first you must have correct views based on your life. And focussing on your friends, maybe you can notice something that you won't find in your daily life. That maybe will change the feelings about your friends.\n"
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "There are also some problems caused by bad friends, such as loving couples, strange thinkings, bad mood. That is why you need to have this important skill in your life. There is an old saying in China, \"if you stay beside the ink, you will become black one day\", it basically means that your friends can influence you. So think about the friends beside you and make the decisions now. "
                    }
                ],
                "author": "SHFL",
                "tags": [
                    "Bad friends",
                    "suggestions"
                ]
            }
        },
        "d1a35900-3aac-11e9-98be-695d9e3c45a1": {
            "type": "story",
            "value": {
                "id": "d1a35900-3aac-11e9-98be-695d9e3c45a1",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "title": "Learning how to build Confidence ",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "Hi I'm just want to tell my experience that its hard to me to order food from restaurant or fast food. Its hard for me to order because I'm just came here in Canada for just few months and I was still learning the language here. I used to speak 'tagalog' back in our country. And another reason that I can't order because I have lack of confidence, I thought that every one making fun of me every time I order my food. One thing that learned through months is be friendly and make friends, Because when i was on my first day at school I thought there is no one Flipino but then there is a lot of it. I'm luck because I think 40% of the student in the school Filipino. And that how my confidence build up, Because one of my friends in school taught me to be how to get over my problems. And that's it to get over your problems make alot of friends to build up confidence and how to be independent. Don't forget that there is always a friend to help you."
                    }
                ],
                "author": "Boltubs",
                "tags": [
                    "Making friends",
                    "Building up Confidencce"
                ]
            }
        },
        "d476c450-24b3-11e9-865f-b5fe084cdb92": {
            "type": "story",
            "value": {
                "id": "d476c450-24b3-11e9-865f-b5fe084cdb92",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "title": "My Life as a River",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "My Life as a River by Dallas"
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl": "./uploads/d47034a0-24b3-11e9-865f-b5fe084cdb92.JPG",
                        "alternativeText": null,
                        "description": null,
                        "fileDetails": {
                            "lastModified": 1548868940000,
                            "lastModifiedDate": "2019-01-30T17:22:20.000Z",
                            "name": "IMG_1988.JPG",
                            "size": 1926836,
                            "type": "image/jpeg"
                        }
                    }
                ],
                "author": "Dallas",
                "tags": [
                    "Life River"
                ]
            }
        },
        "d8627900-2a3b-11e9-98f6-71413982cc35": {
            "type": "story",
            "value": {
                "id": "d8627900-2a3b-11e9-98f6-71413982cc35",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "title": "Moving to Canada",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "This is my story of when I moved to Canada. Moving to Canada was a little bit hard Because I stay home for two months. After that I found a job and then I went to work just for six months .And then I started language school.When I Was in my country if I feel sad my family helped me specialy my niece. I remember when I felt sad if I play with her I forget anything . Because I Love her very much and I really miss her .But in Canada it is a little bit hard .Anyway now It is going great .Everything is easier than seven month ago. And I hope it will be easier in the future and I want to learn more to improve my language skills.Finally my opinion :life can be hard but you work harder you are on your way."
                    }
                ],
                "author": "SB",
                "tags": [
                    ""
                ]
            }
        },
        "d8d011b0-3abf-11e9-98be-695d9e3c45a1": {
            "type": "story",
            "value": {
                "id": "d8d011b0-3abf-11e9-98be-695d9e3c45a1",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "title": "Future Destination",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": "A Programmer's Life",
                        "blockType": "image",
                        "mediaUrl": "./uploads/d8ce3cf0-3abf-11e9-98be-695d9e3c45a1.jpg",
                        "alternativeText": null,
                        "description": null,
                        "fileDetails": {
                            "lastModified": 1551292765223,
                            "lastModifiedDate": "2019-02-27T18:39:25.223Z",
                            "name": "30643267165_8411c85bd5_b.jpg",
                            "size": 245960,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "2017, the most special and important year for me, which I finally found my own future destination after 16 years wandering in the world. It happened when I was choosing my grade 12 courses for next school year. I spent more than 4 months to solve it , even though most people think it's not too hard to design their future. During those 4 months, I muddled through each day, didn't know what to or what's the meaning of my life. "
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "The turning point would be my parents heard my story and flied to Canada to help me out. I finally decided that i'm going to learn about computer science, and try to become a programmer after me and my parents had an argument. "
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "Few months later, I looked back to figure out why did I feel it's hard and why I could not make my own decision. Suddenly, I realized that the main reason would be I was not sure what's my hobby or what I really like to do. Also, I was afraid of making bad decision that will destroy my whole life. I asked my parents one more time, they said:\"Don't be afraid at all. In the future, if you find that you don't like what are you doing, you can choose another pathway, as long as you want. There is no right or wrong about future, only you like or not. Beside, you are a only 16 years old boy who has lots of time to waste or make wrong decision.\" My dad told me about his story. He said he doesn't like to work in the bank when he was 27, so he jumped out and spent 2 years to learn statistics which was what he liked. Later on, he was hired by another company, and he enjoys what he is doing now."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "After all, I understand that the worst thing is staying at current achievement and never moving forward, instead if you make decision that you don't like, at least you can learn from it. "
                    }
                ],
                "author": "Bubble Fish",
                "tags": [
                    "Choice",
                    "Future"
                ]
            }
        },
        "dc9cd940-2a39-11e9-98f6-71413982cc35": {
            "type": "story",
            "value": {
                "id": "dc9cd940-2a39-11e9-98f6-71413982cc35",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "title": "My life story",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "I came from Somalia.\nI was born in Somalia and I left to Ethiopia when I was 8 years old.\nWhen I arrived in Ethiopia , I strarted studying. I learned a lot from different subjects Like: Somali, Amharic, English, physics, biology, chimes trey, maths, E.T.C.\nI was learning in Ethiopia over and over for 8 years- I lived half of my life there.\nI was there for a while and ( for more tan 8 years ), I came to Canada. \nEthiopia and Canada have a bigger gap. Such as development , life, and like."
                    }
                ],
                "author": "",
                "tags": [
                    ""
                ]
            }
        },
        "dccd4550-5ca9-11ea-b5cc-0f7c24539387": {
            "type": "story",
            "value": {
                "id": "dccd4550-5ca9-11ea-b5cc-0f7c24539387",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "content": [
                    {
                        "authoringEnabled": true,
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "I’m in grade 8 and go to school from Monday to Friday. I take a bus to my specialized program and that takes about an hour each way. I have 6 classes each day and sometimes have to move to a different classroom. I use a computer to write with but this year I have been trying to write with a pencil or pen and paper because my computer keeps breaking. Sometimes I HAVE to write with pencil and paper because that’s all the teacher supplies for a test or worksheet or because it’s a lot of extra work to look at a printed exercise sheet then put answers on a blank google doc and go back and forth. It gets confusing sometimes and I get distracted. "
                    },
                    {
                        "authoringEnabled": true,
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "I don’t like having to change from one class to another because I don’t get time to focus on a topic or project. The topics and projects have lots of steps and I need time to figure it out and do things properly."
                    },
                    {
                        "authoringEnabled": true,
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "The other day I stayed home from school and worked in my mom’s studio with her. She has a big table with a bench that I sat at for the morning. I worked on a project that was due in a couple of days. What I liked about working at home, besides being with my cat and dog, was that I could take as much time as I needed to do the project, ask my mom questions and get answers right away, stand up and walk around, talk about things that interested me related to the project (but not part of the project), and have help understanding the instructions for the project.\n"
                    },
                    {
                        "authoringEnabled": true,
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "I presented my project the other day in class and think I did ok, but was sad that I forgot to talk about a few things. \n"
                    },
                    {
                        "authoringEnabled": true,
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "I might be able to do school work from home at least one day a week, my mom is talking to the school about it. I was trying to figure out if I can do school work better in the morning or afternoon to help decide if I should do half days at home or one full day. My mom suggested that maybe the mornings are better because I’m usually the first one up (sometimes even at 3am!). But I’m thinking about all the other things in my day that I have to do: cleaning the cat litter, walk the dog, my homework, chores—stuff like that. And the things I want to do: video games, reading, video games, badminton, video games, mindfulness martial arts, video games (hahaha). \n"
                    },
                    {
                        "authoringEnabled": true,
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "I don’t want to give up my friends in school, the ones whom I’ve known since I started going to another school outside my community in grade 4. They know me and I know them and we play games during the lunch break. \n"
                    }
                ],
                "title": "Getting my work done",
                "author": "",
                "tags": []
            }
        },
        "dea165c0-25ad-11e9-a55a-317414fdb830": {
            "type": "story",
            "value": {
                "id": "dea165c0-25ad-11e9-a55a-317414fdb830",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "title": "The choice",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": "Don't let school interfere with your education",
                        "mediaUrl": "./uploads/de990150-25ad-11e9-a55a-317414fdb830.aac",
                        "alternativeText": null,
                        "description": "A short story of a choice I made to focus on real world change instead of writing silly papers.",
                        "blockType": "audio",
                        "fileDetails": {
                            "lastModified": 1548975328000,
                            "lastModifiedDate": "2019-01-31T22:55:28.000Z",
                            "name": "Voice0060.aac",
                            "size": 3491719,
                            "type": "audio/aac"
                        }
                    }
                ],
                "author": "Liam O'Doherty",
                "tags": [
                    "Education",
                    "employment",
                    "decision making"
                ]
            }
        },
        "dfe98870-879d-11e9-b178-a79380bdbe47": {
            "type": "story",
            "value": {
                "id": "dfe98870-879d-11e9-b178-a79380bdbe47",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "title": "The Crash",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "One day, I was biking with my family to the C.N. tower.\nIt was a nice bike ride, until the incident on the way back. I was biking around a corner when a car came zooming around.\nI was hit.\nI was so scared, and I thought that was the end, but luckily, they braked in time, and all I got from it was a scar.\nEven so, I am forever traumatized, and I will not bike to the C.N. tower ever again.\nThis event changed me as a biker, not because of the Tower itself, but because of the fact that I was taking the route to the C.N. tower when I got hit (I will still walk to it though).\n\nThe end"
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "CN Tower",
                        "blockType": "image",
                        "mediaUrl": "./uploads/dfe73e80-879d-11e9-b178-a79380bdbe47.jpg",
                        "alternativeText": "Picture of the C.N. Tower, which is a skinny tower with a point at the top.",
                        "description": "One of the tallest structures in the world.",
                        "fileDetails": {
                            "lastModified": 1559740618901,
                            "lastModifiedDate": "2019-06-05T13:16:58.901Z",
                            "name": "cn-tower-toronto-ontario-th.jpg",
                            "size": 198547,
                            "type": "image/jpeg"
                        }
                    }
                ],
                "author": "NDS",
                "tags": [
                    "C.N. Tower",
                    "Crash"
                ]
            }
        },
        "e5ca8010-87d8-11e9-b178-a79380bdbe47": {
            "type": "story",
            "value": {
                "id": "e5ca8010-87d8-11e9-b178-a79380bdbe47",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "title": "Learning to spell took 25 years",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "When I was in school (elementary and high school) I was learning two languages, English and French. I lived in an area that was 98% French and we spoke English at home. I could more easily understand the spelling of French words than I could English words. English words didn’t visually make sense to me, I associated the sound of words with shapes but English had so many “exceptions”. Because I wasn’t doing well on my spelling tests and I always had the least number of stickers on the evaluation board that everyone saw every day I felt like I wasn’t smart. This stayed with me for a very long time until I learned to spell and write when I started a job and got to work with stories, writers and copy editors. This was the best (and most fun) learning I had. I even became an editor after several years of learning on the job. It’s also important to know that I never told anyone about my learning difference or how I felt because of it—I think I would have been less lonely if I could have talked about it!\n"
                    }
                ],
                "author": "CC",
                "tags": [
                    "spelling",
                    "language"
                ]
            }
        },
        "ea0261e0-3abf-11e9-98be-695d9e3c45a1": {
            "type": "story",
            "value": {
                "id": "ea0261e0-3abf-11e9-98be-695d9e3c45a1",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "title": "A hunter",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "Hello, everyone. Today, I would type some of my life story. I have came here for 2 years. When I was in grade 9, I took career class. From this class, I learned how to write a resume and cover letter. It really help me to find a job in the future. In high school, I also learned about writing skills in my English class. My teacher taught me how to write an essay. An essay can help me get higher mark in English test. The last skills I learned is from video games. I used to play video games by my father's computer. Till last month I bought a ps4 pro. I like trying new games. This steps really make me exciting. From video games, I could learn a lot. Like new game Apex Legends.I can learn teamwork, attack enemies together, share the material with my teammate. I really learn a lot from game. Through those things, I think I can learn more skills in the future."
                    }
                ],
                "author": "Jack",
                "tags": [
                    ""
                ]
            }
        },
        "f0496030-3aab-11e9-98be-695d9e3c45a1": {
            "type": "story",
            "value": {
                "id": "f0496030-3aab-11e9-98be-695d9e3c45a1",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "title": "Learning something requires process ",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "Presenting something in front of a class is not easy as I thought it was going to be because you're going to be exposed in front and speaking to many people. Way back home in the Philippines I wasn't that kind of person who likes to present in front or even recite something on class even it's my language because I grew up with a family where my family members does not have connection with each other. So I grew up with no confidence in myself and become so shy person."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": " But when I came here in Canada my life really changed, I thought it's gonna be easy for me to communicate using an English language but it wasn't. Since I'm a shy type person I couldn't talk to someone using English. When school starts again, I wasn't that ready but I have to! At first, I thought I have to introduce myself in front but thank God because I didn't do that. It's kinda nervous and it's also kinda embarrassing to be in front with your classmates and teachers who's listening to you. You may missed pronounce words and your classmates will laugh at you is gonna be the most embarrassing moment in your life. Personally, I am a shy type person who doesn't want to be exposed to many people. I don't even want to talk to someone or approaching/asking them how was their day? or how's their school?"
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "But since, each day of my life I learned how to be confident to speak to other people without any hesitation or nervous, I also learned how to present in front with confidence. And I learned those because my teachers really pushed me to do that, they were the one who believed in my skills and they were also the one who told me that I can do it. They said that I have to believe in myself and to conquer my fears and now, I already have the confidence to present in front without any fear or any hesitations. And because of my teachers out there who really taught me to be very confident, Thank You! Because of you all, I stepped out my self to my comfort zones. And to those students out there who has fear and hesitating to present in front, You all can do it!! Just always practice, believe in yourself, and have confident to show your ability to others. I hope, I inspire some of you! :) "
                    }
                ],
                "author": "",
                "tags": [
                    "Public speaking",
                    "Having confidence"
                ]
            }
        },
        "f233f280-3af5-11e9-98be-695d9e3c45a1": {
            "type": "story",
            "value": {
                "id": "f233f280-3af5-11e9-98be-695d9e3c45a1",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "title": "It's cold outside",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "Hello, I emigrated to Canada 10 years ago. \nI'm still not used to the snow...\n"
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl": null,
                        "alternativeText": null,
                        "description": null,
                        "fileDetails": null
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "mediaUrl": null,
                        "alternativeText": null,
                        "description": null,
                        "blockType": "audio",
                        "fileDetails": null
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "mediaUrl": null,
                        "alternativeText": null,
                        "description": null,
                        "blockType": "video",
                        "fileDetails": null
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "mediaUrl": null,
                        "alternativeText": null,
                        "description": null,
                        "blockType": "audio",
                        "fileDetails": null
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl": null,
                        "alternativeText": null,
                        "description": null,
                        "fileDetails": null
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": null
                    }
                ],
                "author": "Henrique",
                "tags": [
                    ""
                ]
            }
        },
        "f506e680-5ca9-11ea-b5cc-0f7c24539387": {
            "type": "story",
            "value": {
                "id": "f506e680-5ca9-11ea-b5cc-0f7c24539387",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "content": [
                    {
                        "authoringEnabled": true,
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "We get a lot of printed worksheets and handouts in math class. I find them confusing because they are always different to me. They look different and what they are about is different. We have to do all the worksheets and then the teacher tells us the answers in class and we mark our own stuff. After each module--say geometry--we have hand in all our worksheets to the teacher. They count for marks. When I went to hand in mine the teacher wouldn’t accept them, she told me to organize them. I went back to my desk and did that but she still wouldn’t accept them. I didn’t tell anyone but my mom found out when she was organizing my binder with me. She asked me if there were any instructions on how to organize everything, like a rubric with some “scaffolds” on how to do it. Well there isn’t. I was really angry when I told her the story.\n"
                    }
                ],
                "title": "Organizing my math papers",
                "author": "",
                "tags": []
            }
        },
        "f8e405f0-24b3-11e9-865f-b5fe084cdb92": {
            "type": "story",
            "value": {
                "id": "f8e405f0-24b3-11e9-865f-b5fe084cdb92",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "title": "Learning to live with Anxiety & Depression",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": "Living with Anxiety and Depression",
                        "blockType": "text",
                        "text": "My learning journey involves learning to live with depression/anxiety. It started by identifying the things that would ground me and help lift me out of those periods of my life. The three things that help with that are my music corner, records/cds, and my pets. When I started this journey, it was hard to identify when these periods of anxiety and depression were coming up. Eventually I learned what the beginning of anxiety looked like for myself, and what the beginning stages of a depressive episode looked like as well. It took a long time to identify these triggers that would put me on a path to anxiety and depression. As I learned more about myself and my relationship with both anxiety and depression, I found ways that I could ground myself and prevent myself from spiralling into those episodes. The things that I found worked were going back to playing music, listening to my records, and hanging out with my pets. These same three things are what I had forgotten about when I first experienced the biggest episode of anxiety and depression. "
                    }
                ],
                "author": "M",
                "tags": [
                    ""
                ]
            }
        }
    }
});
