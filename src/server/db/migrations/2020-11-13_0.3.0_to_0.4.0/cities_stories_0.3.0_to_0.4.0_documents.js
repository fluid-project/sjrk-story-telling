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
        "02067af0-d68e-11e9-878e-13cc3403c489":
        {
            "type": "story",
            "value": {
                "id": "02067af0-d68e-11e9-878e-13cc3403c489",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "It was a cool and sunny winter day. James was going to the store to buy Cheezies to take to his seniors club but today’s trip is not like a regular day, because he has a cast on his left arm. Luckily for James he was right-handed. It was still tricky for him to get around with his cane. But today, James was determined to go outside and get what he needed for his new seniors club. James was not sure what he was getting himself into with this shopping trip but he was willing to give it a try and see what it was like shopping with a cast. "
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl":"./uploads/02023530-d68e-11e9-878e-13cc3403c489.jpeg",
                        "alternativeText": null,
                        "description": null,
                        "fileDetails": {
                            "lastModified": 1568377436000,
                            "name": "city.jpeg",
                            "size": 14221,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "James grabbed his backpack and put it over his shoulder a bit clumsily. \nJames left his apartment, slamming his door behind him. “It drives me up the wall that I have to balance my cane and bag with this bum arm. That stupid driver! If he had just waited until I had sat down before moving, none of this would have happened. I wouldn’t have fallen and broken my arm.” Unfortunately, it happened all the time that the bus driver would drive off in a rush. James wished that there was a signal to let the driver know when he was safely seated. "
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl":"./uploads/02025c40-d68e-11e9-878e-13cc3403c489.jpeg",
                        "alternativeText": null,
                        "description": null,
                        "fileDetails": {
                            "lastModified": 1568377436000,
                            "name": "button.jpeg",
                            "size": 7993,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "After walking for a block, James began to calm down. He felt like he belonged because this was his neighbourhood. He saw people that he knew and started to feel better. He felt that he was getting all the garbage out of his mind. James arrived at the store in a better mood. He enjoyed coming to the store because he knew what it was all about. He could go out and get what he wanted all by himself and he liked that experience. It was so nice that the store was near James’ home. He could go whenever he wanted. "
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl":"./uploads/02028350-d68e-11e9-878e-13cc3403c489.jpeg",
                        "alternativeText": null,
                        "description": null,
                        "fileDetails": {
                            "lastModified": 1568377436000,
                            "name": "store.jpeg",
                            "size": 20447,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "James always felt that he could be independent at this store because it had a railing on both sides of the entrance so he felt secure on the step and he knew where his favorite foods were. However, today James is buying Cheezies, which is something new and he doesn't know where to find it. James looked for a friendly face and spotted his favorite cashier. He asked her for help and she was happy to help him to buy Cheezies. The cashier even helped James puts the Cheezies in his bag. It’s hard to manage a zipper with one hand and keep his cane from falling. "
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "mediaUrl":"./uploads/blob:https://stories.cities.inclusivedesign.ca/8441ef09-1cf2-0c4f-8afa-2b094f668f0c",
                        "alternativeText": null,
                        "description": null,
                        "fileDetails": {
                            "lastModified": 1568377436000,
                            "name": "cheesies.jpeg",
                            "size": 6278,
                            "type": "image/jpeg"
                        },
                        "text": "On the way home, James glances at his watch and realises that he’s running late. “Oh no, I booked Wheel Trans for 1:00” James had to be at the front of his building on time because Wheel Trans would not wait and if he missed it he wouldn’t get to go. James hurried home but had to be careful because it was winter and the sidewalks could be slippery. “It's not the ice you see that you have to worry about,” James muttered to himself. James arrived at the front of his building, “made it!” James felt relief. Despite the blue sky it’s chilly so James decides to wait in the foyer. “Ah, that’s better.” James let the warmth from the heater take the chill off. "
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "James keeps a close out the door as he waits and waits and waits. James glances at his watch, and waits some more. Finally, at 1:40, Wheel Trans arrived. “I wish I could take the bus like I used to but it just isn’t safe anymore.” James felt anger at the driver for being so late but he smiled anyway and was polite because he might get the driver again and he relies on the driver and doesn’t want to get in his bad books. "
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "text": "James keeps a close out the door as he waits and waits and waits. James glances at his watch, and waits some more. Finally, at 1:40, Wheel Trans arrived. “I wish I could take the bus like I used to but it just isn’t safe anymore.” James felt anger at the driver for being so late but he smiled anyway and was polite because he might get the driver again and he relies on the driver and doesn’t want to get in his bad books. ",
                        "mediaUrl":"./uploads/0202aa60-d68e-11e9-878e-13cc3403c489.jpeg",
                        "alternativeText": null,
                        "description": null,
                        "fileDetails": {
                            "lastModified": 1568377436000,
                            "name": "bus.jpeg",
                            "size": 9510,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "mediaUrl":"./uploads/blob:https://stories.cities.inclusivedesign.ca/74941cdb-0abc-794b-b098-9f1d1c82a613",
                        "alternativeText": null,
                        "description": null,
                        "fileDetails": {
                            "lastModified": 1568377436000,
                            "name": "bus.jpeg",
                            "size": 9510,
                            "type": "image/jpeg"
                        },
                        "text": "Safely on his way to the senior’s club at the community centre, James lets the frustration of the wait go and begins to feel excited about getting out. James had been to seniors club a few times and he liked going but he was still feels like the new person and, so he is a little nervous too. Today is the first time Jame is going to the club without Anib, his support worker. James thought Anib was the friendliest person he had ever met. Anib knew James’ interests and helped him find the seniors club to join. Anib also gave James the support that he would need to get to the club, meet the coordinator and feel comfortable getting to know the other members. Anib helped him find his way around and know where things are. "
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "James had really missed people since he retired from his job and he missed his responsibilities of helping out and giving back to the community. He was an expert at what he did and had enjoyed every minute of it. This senior’s club was a chance for James to meet new people and to have a new responsibility and a role. This week, James is part of the food committee and has the job of helping to organize the snacks. "
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "text": "James had really missed people since he retired from his job and he missed his responsibilities of helping out and giving back to the community. He was an expert at what he did and had enjoyed every minute of it. This senior’s club was a chance for James to meet new people and to have a new responsibility and a role. This week, James is part of the food committee and has the job of helping to organize the snacks. ",
                        "mediaUrl":"./uploads/0202d170-d68e-11e9-878e-13cc3403c489.jpeg",
                        "alternativeText": null,
                        "description": null,
                        "fileDetails": {
                            "lastModified": 1568377434000,
                            "name": "seniors club.jpeg",
                            "size": 13443,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "mediaUrl":"./uploads/blob:https://stories.cities.inclusivedesign.ca/8dfa12b8-765c-3a44-906f-a1b2214e6620",
                        "alternativeText": null,
                        "description": null,
                        "fileDetails": {
                            "lastModified": 1568377434000,
                            "name": "seniors club.jpeg",
                            "size": 13443,
                            "type": "image/jpeg"
                        },
                        "text": "It was great that the seniors had their own space within a larger community centre. They had a room just for them and for their things but could see all the different activities around them, kids and parents, newcomers learning English, young people exercising. There was a lot going on all the time but, in their space, things were slower- paced and quieter. The room was just for them and everything that they needed was in that one spot. "
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "When James arrived at the senior’s club, he began to set up the food table and along came Wally. Inwardly, James sighed. Wally was never happy unless he was telling people what to do. “Don’t put the Cheezies in the chip bowl. “ Wally sniped. James wanted to say, “Cheezies, chips what’s the difference?” but talking to Wally was like talking to a wall. “Perfect name,” thought James, he didn’t feel safe with Wally and wondered why Wally couldn’t be friendly. "
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "text": "When James arrived at the senior’s club, he began to set up the food table and along came Wally. Inwardly, James sighed. Wally was never happy unless he was telling people what to do. “Don’t put the Cheezies in the chip bowl. “ Wally sniped. James wanted to say, “Cheezies, chips what’s the difference?” but talking to Wally was like talking to a wall. “Perfect name,” thought James, he didn’t feel safe with Wally and wondered why Wally couldn’t be friendly. ",
                        "mediaUrl":"./uploads/0202f880-d68e-11e9-878e-13cc3403c489.jpeg",
                        "alternativeText": null,
                        "description": null,
                        "fileDetails": {
                            "lastModified": 1568377436000,
                            "name": "cheesies.jpeg",
                            "size": 6278,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl":"./uploads/0202f881-d68e-11e9-878e-13cc3403c489.jpg",
                        "alternativeText": null,
                        "description": null,
                        "fileDetails": {
                            "lastModified": 1568377434000,
                            "name": "men arguing.jpg",
                            "size": 55808,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "James looked for the Cheezie bowl but had know idea which bowl would keep him out of trouble with Wally so he turned to the activities coordinator, Mary, who was always willing to help people who need help. Mary helped James with the bowl and thought about the problem James’ discomfort with Wally and Wally’s need to have everything just so. Mary knew from her meetings with Anib that James was a good listener and enjoyed hearing about everyone’s day. Mary asked James to lead the group in sharing their stories from the past week. James was good at making everyone feel comfortable and listened well. He made people feel heard. Even Wally was willing to share his stories. James and Wally realised that they had some things in common. "
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "After story-sharing, Mary suggested that James and Wally work together to label the cupboards and the things inside so that everyone would know where everything goes and what each thing is for. James is really good at drawing and he uses pictures to help label the bowls and Wally prints neatly so he writes all of the words. From that day on, everyone could know which bowl was for Cheezies and which was for chips. "
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl":"./uploads/020346a0-d68e-11e9-878e-13cc3403c489.jpg",
                        "alternativeText": null,
                        "description": null,
                        "fileDetails": {
                            "lastModified": 1568377434000,
                            "name": "cupboard edited.jpg",
                            "size": 26636,
                            "type": "image/jpeg"
                        }
                    }
                ],
                "title": "Jame's Story",
                "author": "",
                "tags": []
            }
        },
        "11ccefa0-d64d-11e9-878e-13cc3403c489":
        {
            "type": "story",
            "value": {
                "id": "11ccefa0-d64d-11e9-878e-13cc3403c489",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": "Starting the Day",
                        "blockType": "text",
                        "text": "My guide dog and I start our morning with a walk by the lake. This is a favourite\nspot because the boardwalk is wide and the white benches and handrails stand\nout against the background. I enjoy the soft sound of the waves and birds and\nthe feeling of being with nature. This is a calming space for me as I get ready for\nthe day ahead. I have a hearing loss as well as being legally blind so these\nmoments of quiet are important to me."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl": "./uploads/11c108c0-d64d-11e9-878e-13cc3403c489.JPG",
                        "alternativeText": "People-friendly street.",
                        "description": "People-friendly street.",
                        "fileDetails": {
                            "lastModified": 1568396004360,
                            "name": "IMG_0886 - Copy.JPG",
                            "size": 524777,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl": "./uploads/11c2dd80-d64d-11e9-878e-13cc3403c489.JPG",
                        "alternativeText": "Boardwalk by the lake.",
                        "description": "Boardwalk by the lake.",
                        "fileDetails": {
                            "lastModified": 1568395977574,
                            "name": "IMG_0894 - Copy.JPG",
                            "size": 893146,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "Heading Downtown",
                        "blockType": "text",
                        "text": "I am heading to downtown Toronto for a professional conference. I head to my\nlocal GO train station with my guide dog and we meet up with my human\ncompanion. I’m thankful for the portable ramp onto the accessible train car. It’s\neasier as the steps are hard to navigate."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "When we disembark at Union Station, we make our way to the elevator. I’m not\nable to see the buttons on the panel, even though it has red backlighting. It is\nnot enough contrast for me to see. I have to wait for someone else to push the\nbutton. The Braille buttons are a nice \"feel good\" feature for those who are\nsighted or blind (if the blind can find it...). Not many low vision persons know\nBraille."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "When we get off the elevator, we are now in what I call “chaos,” with people\nrushing in every which direction. My companion struggles to find the sign to the\nstreet because the station has changed so much recently. The environment at\nUnion is constantly changing due to the ongoing renovations. This makes it\nconfusing to find our way around."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl": "./uploads/11c54e80-d64d-11e9-878e-13cc3403c489.jpg",
                        "alternativeText": "Go Train",
                        "description": "GO Train",
                        "fileDetails": {
                            "lastModified": 1568396030657,
                            "name": "cover_photo_26_0.jpg",
                            "size": 52205,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "On the Streets",
                        "blockType": "text",
                        "text": "We finally make our way to street level. The constant sounds of traffic (trucks are the worst!), construction noise, and people talking all blend into a cacophony of sound. It is hard to hear my companion so conversation is not easy. Waiting at an intersection for our light to turn green, a wide-bodied truck makes a right turn in front of us. My companion pulls me back a few feet to avoid contact with the truck body and wheels. What seems like numerous encounters with construction hoardings has us veering off to the right or left to walk along the temporary wood surface. These tactile changes my feet felt, combined with the construction noises, do not feel safe."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "Navigating Steps",
                        "blockType": "text",
                        "text": "I arrive at the conference venue feeling very stressed. This is not helped by the fact that I almost fell down the stairs when making my way to the correct floor amid a crowd of other conference-goers. The stairs don’t have a continuous handrail and there are no tactile markings on the floor. I don’t know where the stairs begin and end. A ramp would have been better!\n"
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "Dinning Out",
                        "blockType": "text",
                        "text": "After the last panel at the conference, a group of colleagues and I decide to continue the discussion at a nearby restaurant. The restaurant website indicates that it is accessible. On the way to the restaurant, I look for an area to relieve my dog. I know she has to go, but there is only concrete. All of a sudden, my dog stops smack in the middle of a sidewalk and has a poop. I always travel with (empty!) poop bags so I pick it up. It is a while before my companion points out a garbage can and I deposit it. This is not the first time my dog has dumped on the sidewalk. (Hint to neighborhood designers and developers: please provide obvious relief areas for service and pet animals. Could be as simple as a large square of dirt next to a curb side tree and a garbage can next to it.)"
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "The hostess at the restaurant is putting tables together to accommodate our large group. We explain to the hostess we need a table with a bright light because of my low vision. But once we’re seated, I find it’s not bright enough for my needs. I ask if the lights can be turned up and the answer is no. The noise level of music and people talking and dishes/glasses clinking is loud and it is hard to have a conversation with anybody. We are handed menus and I put mine aside. The server comes to our table and starts talking rapidly. \"Hi, my name is ? And I am your server tonight. The specials are blah blah blah ...... And comes with blah blah blah. And the soup is blah blah blah. Can I get you something to drink?\""
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "I have no clue what the specials are as it was too noisy to hear and too fast to follow. By now, YES, I need a drink! I order my usual as it's a standard drink. My companion tells me slowly and clearly what the specials are. We order our food. When it arrives, I cannot figure it out. My companion is accustomed to telling me things like: the potatoes are at 6 o'clock, the meat is at 9 o'clock, etc. This time, however, he looked flummoxed. The menu did not describe this as a DIY (do it yourself) assembly dish. This was a lettuce wrap that I had to put together myself from a literal head of lettuce. It was definitely not \"blind friendly\". The waiter came over and explained how to put it together for EACH bite. I could not see to do this so ended up picking away at the individual ingredients. Not enjoyable."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "Meanwhile, the noise level is getting to me. If I turn the hearing aids down it is hard to hear the people around me. If I leave the hearing aids alone, it is still difficult. I’m missing all the jokes and stories people are sharing with one another. The connections that they are making is something I am not a part of. Watching my fellow group members interact and not being able to participate makes me feel isolated. I’m not enjoying this, I’m enduring it. I can’t wait for the meal to end."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl": "./uploads/11c5eac0-d64d-11e9-878e-13cc3403c489.jpg",
                        "alternativeText": "Busy restaurant.",
                        "description": "Busy restaurant.",
                        "fileDetails": {
                            "lastModified": 1568396055438,
                            "name": "here-is-the-restaurant.jpg",
                            "size": 55877,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "Using the Washroom",
                        "blockType": "text",
                        "text": "I need to use the washroom before we leave. As I bump my way past tables that are too close together, I reflect that this is not a wheelchair friendly space as well as not low vision or hard of hearing friendly. The washroom is dimly lit. The stall doors and partitions are dark and so are the walls of the room. I finally spot a white toilet and use it. The sink and soap are manageable although finding the dark paper towels and garbage can is a challenge. And the door to get out of the washroom is the same color as the walls. Finally, I see the glint of a metal handle on the door and open it."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "Home Sweet Home",
                        "blockType": "text",
                        "text": "When I get home, I realize how tense my shoulders are. I feel drained from the challenging day I just had. Home sweet home!"
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl": "./uploads/11c638e0-d64d-11e9-878e-13cc3403c489.JPG",
                        "alternativeText": "Dirt path near water and trees.",
                        "description": "Dirt path near water and trees.",
                        "fileDetails": {
                            "lastModified": 1568395911853,
                            "name": "IMG_0897.JPG",
                            "size": 2454393,
                            "type": "image/jpeg"
                        }
                    }
                ],
                "title": "Into the Chaos",
                "author": "",
                "tags": [
                    "hard of hearing",
                    "low vision",
                    "accessibility",
                    "way\u0000nding",
                    "cities"
                ]
            }
        },
        "232dabb0-d501-11e9-b489-e9b807f15c0e":
        {
            "type": "story",
            "value": {
                "id": "232dabb0-d501-11e9-b489-e9b807f15c0e",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": "",
                        "blockType": "text",
                        "text": "My daily commute in the city is pretty intense. While walking too and from the subway to my destination, I am constantly reminded of the city’s homeless crisis with the increasing number of men and women sheltering on the street. The city needs a sustainable solution to better accommodate people in less fortunate situations, but part of the problem is the increasing housing prices in Toronto. Since cost of living the city is so high, many people live around Toronto and depend on the transit system to get to work. In the Toronto transit, the mornings around 9 am and in the afternoon at 5pm, it get's extremely crowded underground. I usually have to wait for a couple of full cars to pass me before I can get on the subway. With so many people working downtown that don't live here, the commute is becoming more and more packed. Since the population is increasing, but the transportation system is remaining the same, the only solution would be to have a greater number of subways running. However, that's not easily done. It would take years, for adaptation, so for the time being, that just means a longer commute time. Now adding on top of that, is the fact that there are only two main underground lines. Line1 and Line 2. If theres a delay, it affects EVERYONE. Someone may have called for assistance at College Station, that would then cause delays on the entire Line 1. In the summer, when there is added body heat, and delays occur underground, it is an absolute nightmare. One time around 5:14 my train on Line 1 got stuck underground. For the next 20 min there was a gradual rise in panic. People started feeling claustrophobic and someone even fainted."
                    }
                ],
                "title": "A Day in Toronto",
                "author": "Zoya, Nahin & Tania",
                "tags": [
                    "toronto",
                    "transit",
                    "commute",
                    "subway",
                    "housing",
                    "underground",
                    "city"
                ]
            }
        },
        "3b5d85b0-d4fd-11e9-b489-e9b807f15c0e":
        {
            "type": "story",
            "value": {
                "id": "3b5d85b0-d4fd-11e9-b489-e9b807f15c0e",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "PI is an active individual who likes to ride bicycle. He generally doesn't ride in downtown area and he is not very familiar with the environment. While riding bike he drinks plenty of water to keep himself hydrated in hot weather. However, drinking lot of water makes him go to the washroom frequently. On a very hot day, PI is exploring the downtown area on his bike and he comes across the intersection where there is no traffic light to cross the street. He finds it very confusing and in a hurry he tries to cross the street light and he almost got hit by a tour bus. This sudden incident startles him and he became very nervous. He drank the last drop of water out of his bottle. He parked his bike , locked it and wanted to find a drinking fountain at nearby shopping mall. He finds the Eaton centre and at the entrance he found the washroom which is fully occupied. \n"
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "He tries to locate the next available washroom and it was towards the very end of the shopping mall. It's quite a long distance and he rushed towards the washroom but realised it's only female washroom. Mens' washroom was available downstairs. Instead of going downstairs he uses the disabled washroom. He goes back to the area where he had parked the bike but by the time he got there the bike was stolen. \n"
                    }
                ],
                "title": "Life of PI",
                "author": "Erman, April and Apala",
                "tags": [
                    "bike",
                    "washroom",
                    "drinking fountain and traffic light"
                ]
            }
        },
        "9e2d0b30-d4fc-11e9-b489-e9b807f15c0e":
        {
            "type": "story",
            "value": {
                "id": "9e2d0b30-d4fc-11e9-b489-e9b807f15c0e",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": "",
                        "blockType": "text",
                        "text": "Steve, a blind man living in a basement who is sensitive to everything except vision. He wants to avoid bad smells and sounds and get where he's going precisely so he has to plan routes.\n\nSteve wakes up and he can smell yesterday's dinner and it depresses him. Last night, he ate pizza and the smell lingers. The sound of the construction outside penetrate through the walls. He can also hear the streetcars bumping along the line constantly and shaking his building. This has caused him to not get enough sleep. He feels like a zombie. The second floor above has three cats living in the building and they've been running around all night."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl": "./uploads/9e2a2500-d4fc-11e9-b489-e9b807f15c0e.jpg",
                        "alternativeText": null,
                        "description": "A picture of stinky pizza from yesterday's dinner.",
                        "fileDetails": {
                            "lastModified": 1568250963448,
                            "lastModifiedDate": "2019-09-12T01:16:03.448Z",
                            "name": "65130590_2283313075091979_2114667185870733312_n.jpg",
                            "size": 96332,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "Steve has to get to a job interview at 9:00am. He smells some pizza on his shirt. Once he leave his basement apartment, and smells fresh air, he notices that even his clean clothes smell like pizza. He has to search for the interview location on his phone, but he's got a headache because of the lack of sleep and noise. At least the pizza was good. I guess. Oh no, Steve is late for his interview. He kind of knows the area well, but there's construction that just started today so there's temporary fences and walls everywhere disorienting him."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl": "./uploads/9e2a7320-d4fc-11e9-b489-e9b807f15c0e.jpg",
                        "alternativeText": null,
                        "description": "A picture of construction.",
                        "fileDetails": {
                            "lastModified": 1568250974711,
                            "lastModifiedDate": "2019-09-12T01:16:14.711Z",
                            "name": "70508084_2845090525504421_2525775137546960896_n.jpg",
                            "size": 40290,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "Steve asks someone on the street for directions, but the construction noise is too loud and couldn't understand the directions so he goes in the wrong direction. The person helping him is really nice and helps Steve to the building. But before they reach the entrance, they have to leave. And that's why Steve had to spend twenty more minutes looking for the door."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl": "./uploads/9e2ac140-d4fc-11e9-b489-e9b807f15c0e.jpg",
                        "alternativeText": null,
                        "description": "A picture of the bank Steve is applying for a job.",
                        "fileDetails": {
                            "lastModified": 1568251116386,
                            "lastModifiedDate": "2019-09-12T01:18:36.386Z",
                            "name": "70016853_2493778924183222_7067196053652504576_n.jpg",
                            "size": 59025,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "Then he goes in and realizes, the washroom is really smelly. He goes into the elevator and there's no audio feedback for the doors. Steve questions his life. Does he want this job?"
                    }
                ],
                "title": "The Day That Makes You Ask Why...",
                "author": "Alis Panja, Steve Murgaski, Nikkie To",
                "tags": [
                    "blindness",
                    "smell sensitivity",
                    "noise sensitivity"
                ]
            }
        },
        "b7b40610-d67f-11e9-878e-13cc3403c489":
        {
            "type": "story",
            "value": {
                "id": "b7b40610-d67f-11e9-878e-13cc3403c489",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "I was driving into the parking lot and parked in a designated wheelchair parking. When I went to pay I realized it was rather difficult due to non-adjustable parking meter. From my angel seated in my wheelchair, the glare from the lights above me made it difficult for me to see the screen. The number to call for assistance went straight to voicemail. I left a voicemail with my license plate and cellphone number and stated that the machine was not reading my credit card. Digital options were simply not working, and I desperately needed a more human connection for assistance."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl": "./uploads/b7af7230-d67f-11e9-878e-13cc3403c489.jpg",
                        "alternativeText": "Paid parking sign with instructions and contact information",
                        "description": "Paid parking sign with instructions and contact information. \nSign that reads: Private Property, Pay Parking, Patrolled and Enforced 24 Hrs a Day. If you park and do not display a valid ticket or permit, the rate it $65.75?day or portion thereof. In addition, your vehicle may be subject to being ticketed and/or towed at owner's expense. t. 647.503.6006 www.go-parking.com LOT#G010",
                        "fileDetails": {
                            "lastModified": 1568376584000,
                            "name": "pay parking.jpg",
                            "size": 65588,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl": "./uploads/b7afc050-d67f-11e9-878e-13cc3403c489.jpg",
                        "alternativeText": null,
                        "description": "Parking payment method.\n\nShowing where to insert credit card or change for payment method on parking meter.\n",
                        "fileDetails": {
                            "lastModified": 1568376584000,
                            "name": "Parking payment method.jpg",
                            "size": 34457,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "I walked into the grocery store using the specific entrance, and as I was perusing the aisles, I found that there were several staff hovering over me, when all I wanted was for someone to just say “I am here if you need me”. Once I was done getting everything I needed, I found my way to the accessible cashier lane, only to find it unstaffed. So then I went into a regular line, where a customer offered to assist me by taking the groceries out of my bag from the back of my chair onto the conveyor belt. The card reader was also not adjustable. It could not be moved and it was out of my reach, so it was impossible to be able to hide my personal information when I reached over. This was yet another awkward instance where I felt I did not have autonomy."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl": "./uploads/b7afe760-d67f-11e9-878e-13cc3403c489.jpg",
                        "alternativeText": "Shows non-portable card reader which glare from above lights.",
                        "description": "Shows non-portable card reader which glare from above lights.",
                        "fileDetails": {
                            "lastModified": 1568376582000,
                            "name": "non-portable card reader.jpg",
                            "size": 72413,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "No staff assisted me; it was simply other shoppers that offered to help. Common empathy of the average person rather than the attentiveness of staff has been a recurring theme of my shopping experience. Without the kindness of strangers, I often find that advocating for myself in what are monitored public spaces increases the feeling of “invisibility”.\nOnce I was finished I decided to head into the Mall to use the accessible washroom. I found it to not be so accessible after all, as it was in fact also being used as a non-gendered and family washroom. The support handles were not adjustable, and the automatic door was not working making it much harder to open. There were many other non-accessible features of the washroom such as greatly elevated mirror that started at my forehead, as well as a hand dryer that blew into my face. The toilet seat was significantly lower than my wheelchair, which made it difficult to transfer over, as well as the support bar being too high."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl": "./uploads/b7b03580-d67f-11e9-878e-13cc3403c489.jpg",
                        "alternativeText": "Toilet seat is significantly lower than wheelchair.",
                        "description": "Toilet seat is significantly lower than wheelchair.",
                        "fileDetails": {
                            "lastModified": 1568376584000,
                            "name": "Inaccessible toilet seat.jpg",
                            "size": 48695,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl": "./uploads/b7b05c90-d67f-11e9-878e-13cc3403c489.jpg",
                        "alternativeText": "Support bar above shoulder level.",
                        "description": "Support bar above shoulder level.",
                        "fileDetails": {
                            "lastModified": 1568376584000,
                            "name": "Support bar above shoulder level.jpg",
                            "size": 53057,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "Heading back to the grocery store, I started to realize that mall closure had already begun unannounced. I noticed that the accordion gate between the grocery store and the mall had been closed, so I looked for a security guard to ask for assistance. I communicated that I needed passage through the grocery store to get to where I parked."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl": "./uploads/b7b083a0-d67f-11e9-878e-13cc3403c489.jpg",
                        "alternativeText": "Entrance between mall and grocery store blocked by accordion gate.",
                        "description": "Entrance between mall and grocery store blocked by accordion gate.",
                        "fileDetails": {
                            "lastModified": 1568376584000,
                            "name": "Entrance blocked by accordian gate.jpg",
                            "size": 94707,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "He said my only option was to leave through a different exit. This was concerning to me because it was a longer route and I was very tired at this point. I can see through the now closed barricade, other shoppers still using the store on the other side. The solution was simple. I explained to the guard that I needed to go through that exit to get to my vehicle. However, he was resistant. Another customer noticed me on the other side of the gate and approached customer service on my behalf. She was refused by customer service to address the situation. She came over to speak to me, and we discussed the unexpected early mall closure, which had left me feeling unwelcome and devalued as a customer. When she couldn’t find staff to help, she resorted to simply opening the gate herself and letting me through. No special knowledge was required, just compassion. Had this been a digitally timed locking device, this would not have been possible."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "I exited the mall using the grocery store entrance and made my way to my parking space. There was a car double-parked between the designated wheelchair permitted spots. I was unable to leave until another compassionate person came along and offered to move my van so that I could open my automated door and extend the ramp for my wheelchair."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl": "./uploads/b7b0d1c0-d67f-11e9-878e-13cc3403c489.jpg",
                        "alternativeText": "Car double parked between two designated wheelchair accessible spots.",
                        "description": "Car double parked between two designated wheelchair accessible spots.",
                        "fileDetails": {
                            "lastModified": 1568376584000,
                            "name": "Car double parked in accessible parking spot.jpg",
                            "size": 49691,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl": "./uploads/b7b0f8d0-d67f-11e9-878e-13cc3403c489.jpg",
                        "alternativeText": "Accessibility ramp being lowered to demonstrate appropriate space needed in between vans in parking spaces.",
                        "description": "Accessibility ramp being lowered to demonstrate appropriate space needed in between vans in parking spaces.",
                        "fileDetails": {
                            "lastModified": 1568376584000,
                            "name": "Accessibility ramp.jpg",
                            "size": 66596,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "Throughout my day I encountered several instances where getting around was difficult. Barriers to access is a common experience in my daily life and I am appreciative of the awareness and assistance of others when available. This proves that the human factor must remain in designing. When ignored it can affect all aspects of a person's physical, emotional psychological , and social interactions."
                    }
                ],
                "title": "Human Factor",
                "author": "",
                "tags": [
                    "accessibility",
                    "compassion",
                    "invisibility",
                    "value",
                    "consideration"
                ]
            }
        },
        "dabb6100-d67d-11e9-878e-13cc3403c489":
        {
            "type": "story",
            "value": {
                "id": "dabb6100-d67d-11e9-878e-13cc3403c489",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": "",
                        "blockType": "image",
                        "mediaUrl": "./uploads/daa60440-d67d-11e9-878e-13cc3403c489.jpg",
                        "alternativeText": "Person crossing the street",
                        "description": "",
                        "fileDetails": {
                            "lastModified": 1568376008000,
                            "name": "1.jpg",
                            "size": 1606385,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "My story is a story about finding a sense of place in Toronto. My journey as a queer refugee newcomer in Canada would lead me to new and unfamiliar spaces, and through moments when I felt completely alone and times when I felt at home with people I’d only just met. These experiences shaped who I am in a place that I knew nothing about at one point."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "The most important experiences for me were the ones that transpired in ordinary, everyday moments, in transitional spaces, and in quiet and small ways. The growing pains and struggles that came with these experiences would become an important part of my journey. They brought me to my community. They brought me home."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "",
                        "blockType": "image",
                        "mediaUrl": "./uploads/daabf7b0-d67d-11e9-878e-13cc3403c489.jpg",
                        "alternativeText": "Person standing on a background covered with different colors",
                        "description": "",
                        "fileDetails": {
                            "lastModified": 1568376000000,
                            "name": "2.jpg",
                            "size": 2652404,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "A Desire to Belong",
                        "blockType": "text",
                        "text": "As a newcomer in Toronto, it was challenging to navigate the city layered with very different cultures, social norms and unspoken collective agreements shared between strangers. After landing here, I began to notice these differences, often with a debilitating level of acuteness and self-consciousness. In my culture, you are expected to seek out and utilize local knowledge when you are trying to navigate through a new or unfamiliar space; a sense of community is present even in public spaces and shared between strangers. "
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "Here, in moments when I felt lost or confused and wanted to reach out to someone, I encountered apathy and occasionally even hostility. I come from a city that is far more complex and hard to navigate compared to Toronto. I have gotten lost several times while commuting, walking or driving in my city, but each time I was able to find my way with the help of strangers, which eased my anxiety. "
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl": "./uploads/dab0b2a0-d67d-11e9-878e-13cc3403c489.jpg",
                        "alternativeText": "Person crossing the street having thought bubbles",
                        "description": "",
                        "fileDetails": {
                            "lastModified": 1568375998000,
                            "name": "3.jpg",
                            "size": 409464,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "As a newcomer in Toronto, I felt more isolated with each passing day knowing I was on my own if I were to get lost. It took me a while to process and understand the information in maps, signs, schedules, and wayfinders. Often, it overwhelmed me when I was experiencing confusion and anxiety. Language spoken feels more valuable than language read in such situations. The attitudes I encountered reminded me that I was far away from home."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "",
                        "blockType": "image",
                        "mediaUrl": "./uploads/dab14ee0-d67d-11e9-878e-13cc3403c489.jpg",
                        "alternativeText": null,
                        "description": null,
                        "fileDetails": {
                            "lastModified": 1568376010000,
                            "name": "4.jpg",
                            "size": 1542779,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "Searching...",
                        "blockType": "text",
                        "text": "It took me a few years to familiarize myself with this landscape and find spaces where I could connect meaningfully with people. I started working as a community facilitator, and through my practice, I began to connect with people through art and storytelling. Whether it was through poetry, art-making, craft or performance – the presence of art and artists in my everyday life, public spaces and within communities I am a part of made me feel accepted and comfortable to express who I am. I felt new spaces open up for me. I didn’t feel so lost anymore."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl": "./uploads/dab3e6f0-d67d-11e9-878e-13cc3403c489.jpg",
                        "alternativeText": null,
                        "description": null,
                        "fileDetails": {
                            "lastModified": 1568376002000,
                            "name": "5.jpg",
                            "size": 1384796,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "Kinship",
                        "blockType": "text",
                        "text": "Since coming out as queer woman, I had to learn, unlearn and relearn what kinship and family meant to me. As I think about this, my mind travels back to three years ago when I injured my shoulder in a bike collision. I developed chronic pain for which I sought out every kind of treatment I could find. With failing treatments, I had to come to terms with the reality of living with this pain. The permanent sensation of pain reminded me again that I was alone. The family that provided me with care and comfort when I was sick or in pain wasn’t here with me. All around me I saw people who didn’t have to live with pain every day and a culture that glorified physical fitness. The emotional experience of the pain was at times, worse than the physical one.\nBut my pain also gave me the tools to manage my pain in new and unfamiliar ways.\n"
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl": "./uploads/dab630e0-d67d-11e9-878e-13cc3403c489.jpg",
                        "alternativeText": "Person walking on a wooden path in the woods",
                        "description": "",
                        "fileDetails": {
                            "lastModified": 1568375998000,
                            "name": "6.jpg",
                            "size": 1268749,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "In the following years, I sought and found alternative forms of care and healing. The only time I was able to forget about my pain was when I was walking in parks surrounded by old-growth trees, hiking in forests, sitting by the lake, feeding birds and studying trees. I felt myself growing closer and closer to my natural environment. Being near trees, whether in a park or backyard garden, soothed my pain, calmed my nerves and let me connect with something outside of myself. The kinship I developed with trees, birds, and animals not only healed me but made my connection to this place even stronger."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl": "./uploads/dab79070-d67d-11e9-878e-13cc3403c489.jpg",
                        "alternativeText": "Person standing in a small balcony on the second floor of a building",
                        "description": "",
                        "fileDetails": {
                            "lastModified": 1568376004000,
                            "name": "7.jpg",
                            "size": 1393659,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "Putting Down Roots...",
                        "blockType": "text",
                        "text": "My new life in this now familiar place needed a place that I could call home, one that I would be sharing with my partner. I try to forget how frustrating and arduous it was to look for a home as a young, queer POC (person of colour) couple. For a few months in the process, we had to live with the possibility of being forced to move to an area that was remote – disconnected from our support systems and friends. Luckily, we found a home in a tiny attic studio in a neighborhood that we love."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "Looking back at these experiences, I can see how much I have grown in this city and how much the city has grown on me. My story is one of the many, many stories of the people from my newcomer, QTBIPOC community. It is what drives me to help others feel at home wherever they are."
                    }
                ],
                "title": "The Way Home",
                "author": "",
                "tags": []
            }
        },
        "e70890a0-d640-11e9-9605-5d78aa190f9a":
        {
            "type": "story",
            "value": {
                "id": "e70890a0-d640-11e9-9605-5d78aa190f9a",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": "INTRODUCTION",
                        "blockType": "image",
                        "mediaUrl": "./uploads/e7027620-d640-11e9-9605-5d78aa190f9a.jpg",
                        "alternativeText": "Top down shot of lightly coloured stones, different shapes and sizes.",
                        "description": "Inclusiveness is like a precious stone. When someone comes across a precious stone, there are a number of different reactions they may have.\n\nThis story will present some of those reactions as scenarios, and describe how it relates to accessibility and inclusiveness.",
                        "fileDetails": {
                            "lastModified": 1568316201000,
                            "name": "stream-stone-spring.jpg",
                            "size": 104974,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "SCENARIO #1: NEGLECTING TO BE INCLUSIVE",
                        "blockType": "image",
                        "mediaUrl": "./uploads/e7029d30-d640-11e9-9605-5d78aa190f9a.jpg",
                        "alternativeText": "Image of a desert, sand dunes",
                        "description": "One way of reacting to the precious stone is outright dismissing it.\n\nThe Story:\nIn this scenario, the stone is completely ignored. Even though it has a shine, its own appeal, and characteristics, none of those are taken into account. The stone receives no attention and no value.\n\nImpact on Accessibility:\nThere are two different degrees of impact on accessibility: partial and total. \n\nTotal neglect involves no action towards accessibility. This creates stigma and discrimination towards accessibility. It also reinforces the blind spots that society may have about accessibility, making the issue even more challenging to resolve.\n\nPartial neglect occurs when you take some steps towards accessibility, but neglecting parts of it for different reasons. For example, a lack of funding or knowledge leads to partial neglect. Additionally, ignoring feedback on the existing solutions for accessibility also contribute to neglect.\n\nExamples:\n-\tA landlord that is solely interested in maximizing profit at the expense of the tenants. Despite being presented with the case for accessibility, the landlord outright dismisses these needs. Worse even, they use accessibility demands as a reason to divide tenants and make it difficult to find a solution for all.\n\n-\tUsing payment terminals that don’t enable a ”tap” functionality leads to privacy issues. Without a tap, a user has to share their pin with a third party (i.e. cashier) which puts their identity and security at risk.\n\n-\tBanks offer the service of a safety box, which are not designed to be accessible. Both the actual design of the infrastructure and the service itself are limiting and do not work for everyone ",
                        "fileDetails": {
                            "lastModified": 1568316476000,
                            "name": "sand-dunes-1.jpg",
                            "size": 367332,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "SCENARIO #2: INCLUSIVENESS AS A PROP",
                        "blockType": "image",
                        "mediaUrl": "./uploads/e703d5b0-d640-11e9-9605-5d78aa190f9a.jpg",
                        "alternativeText": "Stones at the bottom of a clear glass, filled halfway with water, with plants coming out of glass",
                        "description": "Another reaction to seeing a stone is to think about it as a prop or decoration. \n\nThe Story:\nIn this scenario, the stone is taken from its environment and used as a display piece. For example, this may add a certain aesthetic to someone’s home or serve as a decoration for his or her living space. In this scenario, the stone becomes part of the background; it’s not a focal point. It’s only brought up when it needs to be presented, but otherwise it’s sidelined as an object for display.\n\nImpact on Accessibility:\nHere, we see accessibility as a trend. It’s used as a real-world display piece to demonstrate compliance with legal requirements. This treatment puts more importance on the presentation of meeting accessibility (the superficial), not actually serving the core needs of accessibility (the meaningful).\n\nExample(s):\n-\tElevators that are designed to be accessible, but in fact do not meet the diverse needs of the users its intended to serve. The placement of the control panel is placed out of the hand range, the design of the buttons are limiting, a lack of voice-activated controls, etc.\n\n-\tWashrooms are not equipped with transferring devices for those in need. There is a range of unique, and private, needs that are unmet in washroom designs that don’t respect or dignify the users.",
                        "fileDetails": {
                            "lastModified": 1568317489000,
                            "name": "46d7709ed59d5896540512978ced4034.jpg",
                            "size": 84985,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "SCENARIO #3: INCLUSIVENESS AS A COMMODITY",
                        "blockType": "image",
                        "mediaUrl": "./uploads/e703fcc0-d640-11e9-9605-5d78aa190f9a.jpg",
                        "alternativeText": "A full brick wall",
                        "description": "Another reaction to seeing a precious stone, is to look at how you can use it to your own benefit. Essentially, the stone becomes an object of consumption.\n\nThe Story:\nFor example, the stone can be marketed, promoted, and sold. Driven by these motives, the stone is only valuable by serving the \"business\", not in its own right. The stone is just like any other stone, extracted from its environment and sold for its material benefit.\n\nImpact on Accessibility:\nThis relates to accessibility, because it's often valued from a commercialized or business perspective. This puts accessibility as risk of becoming commoditized. It downgrades the value of those with accessibility needs by dehumanizing the person. Both, the uniqueness and diversity found in inclusivity are removed in favour of efficiency and scale.\n\nExample:\nThe pricing and business model for a variety of accessible products and services demonstrate the commercialization of accessibility:\n-\tPower chairs that come at a price tag that is unreasonable for any individual to purchase, causing them to rely on funding or other means\n-\tAccessible tech and devices that are provided and serviced by organizations and \n-\tThe extremely high price point for accessible vans, and its maintenance at a specialized shops",
                        "fileDetails": {
                            "lastModified": 1568317625000,
                            "name": "R10961_image1.jpg",
                            "size": 103968,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "SCENARIO #4: CORE VALUE OF INCLUSIVENESS",
                        "blockType": "image",
                        "mediaUrl": "./uploads/e7044ae0-d640-11e9-9605-5d78aa190f9a.png",
                        "alternativeText": "A rock with the inner layer exposed to reveal a multi-coloured gem",
                        "description": "Another reaction to coming across the stone is to see, understand, and respect the stone for its own value.\n\nThe Story:\nIn this scenario, the stone is appreciated for its inherent value -- to know it as it is, not as you project. This means understanding all aspects of the stone like its history, environment, variety of characteristics, power of action and its limitations, etc.\n\nImpact on Accessibility:\nWhen it comes to accessibility, this reaction respects, dignifies, and empowers those served by inclusiveness. This involves seeking to understand the needs and challenges from the perspective of those who need it. Ultimately, this puts the focus on the real-life impact of accessibility and creates a habit of ongoing improvement. \n\nExample:\n-\tThe use of ramps in public spaces are an example of taking care of people’s needs\n- Closed Caption is a broad, mass, example of assisting those with hearing challenges",
                        "fileDetails": {
                            "lastModified": 1568317802000,
                            "name": "4ce221c543c8ad90d44e2245e0aa08dc.png",
                            "size": 378477,
                            "type": "image/png"
                        }
                    }
                ],
                "title": "Grades and Shades of Inclusiveness",
                "author": "",
                "tags": [
                    "inclusiveness",
                    "accessibility",
                    "experiences",
                    "urban living",
                    "planning",
                    "infrastructure",
                    "services",
                    "transportation",
                    "attitudes",
                    "perceptions"
                ]
            }
        },
        "eaaf45f0-d64a-11e9-878e-13cc3403c489":
        {
            "type": "story",
            "value": {
                "id": "eaaf45f0-d64a-11e9-878e-13cc3403c489",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": "Starting My Day",
                        "blockType": "text",
                        "text": "I begin my day by waking up. My first prayer of the day is that my scheduled PSW shows up, which is unusual, most days I am left in bed until I can find someone to help me out. Today, she shows up. "
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "Walking My Dog",
                        "blockType": "text",
                        "text": "Now that I am out of bed, and on my wheelchair and ready to go, I have to take my baby out. My baby’s name is Juba and he walks on four legs. So, I put my baby in his bag and took him to the park for about 45 mins. We head back home where I am going to leave Juba in a climatized environment as I’ll be gone for most of the day. I wish there was a way to access the thermostat in case it warms up or cools down during the day while Juba is at home. It would also be great to have a camera to watch him and maybe access to a community dog walker. "
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl": "./uploads/ea979f40-d64a-11e9-878e-13cc3403c489.jpeg",
                        "alternativeText": "Person on the wheelchair carrying a dog in a shoulder bag",
                        "description": "Person on the wheelchair carrying a dog in a shoulder bag",
                        "fileDetails": {
                            "lastModified": 1568313169629,
                            "name": "Dog in a bag.jpeg",
                            "size": 1282601,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl": "./uploads/ea9be500-d64a-11e9-878e-13cc3403c489.jpeg",
                        "alternativeText": "Dog running in the park",
                        "description": "Dog running in the park",
                        "fileDetails": {
                            "lastModified": 1568312773476,
                            "name": "Juba.jpeg",
                            "size": 761844,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "Getting to Work",
                        "blockType": "text",
                        "text": "Back out ago hoping wheel trans will be on time to get me to work. GREAT! Wheel trans is here and I’m off to work. Sometimes wheel trans doesn’t even show up, or it can be up to one hour late, which means I get to work late, and I’ll be late for everything else during that day. It’s a good thing that my work can make accommodation for your tardiness. If the Wheeltrans doesn’t show up I should call the cap, which is very expensive, and it can add to a defect for my budget at the end of the month. Everything in Toronto is very expensive. "
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "At Work - Morning",
                        "blockType": "text",
                        "text": "Today at work, my morning is about giving a workshop on cultural competency, colonization and history of Canada, all the way to treat and reconciliation and working with indigenous individuals and how this history ties into the trauma of today. Most of the individuals in the workshop this morning are police and security. Many of these individuals live in that new smart city, so it’s good for them to hear what the true history of this country is and the genocide that was enacted by the government that still is in power today. When Christopher Columbus got lost, and we as indigenous people found him, life changed for ever for us. Pre Columbus, indigenous people had an amazing simple life, living by the instructions given by the creator to live in harmony with all of our relatives including those that grow on earth, walk on four legs, fly, crawl and swim. How people survived the cultural genocide with our languages and traditions still intact speaks to our resilience. How important it is for those who live in that smart city to understand how to interact and work with indigenous people and this should include all cultures and helping to understand newcomers as well. "
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl": "./uploads/ea9d6ba0-d64a-11e9-878e-13cc3403c489.jpg",
                        "alternativeText": "Slide presentation about history of peace disruption",
                        "description": "Slide presentation about history of peace disruption",
                        "fileDetails": {
                            "lastModified": 1568314169425,
                            "name": "Timeline.jpg",
                            "size": 2294488,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "At Work - Afternoon",
                        "blockType": "text",
                        "text": "After I have done that for the morning, I had my lunch and I’m going to go to the afternoon where I work with the individuals. My work with individuals is around self-determination and how to survive in today’s world, helping them to understand the social norms and orientation to the rules. Many of the people I work with are women fleeing the violence by their significant partner or family members of the missing and murdered indigenous women. For my clients’ survival it is absolutely important to know about social norms and surviving in today’s world of the dominant culture i.e. relationship to white privilege. "
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "Self-Care",
                        "blockType": "text",
                        "text": "What a busy day I have had! and now I have to go to the park and rejuvenate myself. I have brought my medicine that I am going to burn and my hand drum to recreate the heartbeat of mother earth. So, I can connect with my ancestors and not take home the emotions of fear after a hard day of work. You don’t have to take home the other people’s trauma. Today is one of those good days when no one in the park complains to me about my behavior. Some days people in the neighborhood ask me to leave the park because they say that it is loud, and they can’t stand the smell of my medicine burning and, on some days, they literally attack my (physically)—White privilege. "
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl": "./uploads/eaa0c700-d64a-11e9-878e-13cc3403c489.jpg",
                        "alternativeText": "Hand drumming in the park",
                        "description": "Hand drumming in the park",
                        "fileDetails": {
                            "lastModified": 1568314682129,
                            "name": "Drum.jpg",
                            "size": 89106,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl": "./uploads/eaa11520-d64a-11e9-878e-13cc3403c489.JPG",
                        "alternativeText": "Smudging in the park",
                        "description": "Smudging in the park",
                        "fileDetails": {
                            "lastModified": 1568316698275,
                            "name": "smudging.JPG",
                            "size": 247792,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "mediaUrl": "./uploads/eaa18a50-d64a-11e9-878e-13cc3403c489.mp4",
                        "alternativeText": null,
                        "description": "Video showing my path home. The sky is getting cloudy and dark and it seems that it's about to start raining. ",
                        "blockType": "video",
                        "fileDetails": {
                            "lastModified": 1568317212430,
                            "name": "Video.mp4",
                            "size": 10388798,
                            "type": "video/mp4"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "End of My Day",
                        "blockType": "text",
                        "text": "Now it’s time to go home and wouldn’t you know it starts to rain. I hated it when it rains when I go home because I leave south of Gardiner and it’s well known that during a rainstorm it floods under the Gardiner, creating headaches for those one of us trying to get home. Because of Toronto’s lack of infrastructure, the swear floods and the water seeps up to the street and in some case creates power outages and increase pollution in water. When the swear overflows seeps up to the sidewalks and overflows over the manholes and flooding the union station and cars are stuck there. I’m worried about my dog drinking this water and being affected by it. I’m also worried about power outage and if I can get to my unit. \n\nLuckily, I get home and the power is on. So, I take the elevator to my condo and take Jubo for a walk. \n"
                    }
                ],
                "title": "Getting Around",
                "author": "KWEUK (Women Collective)",
                "tags": []
            }
        },
        "ee8d2ca0-d4fb-11e9-b489-e9b807f15c0e":
        {
            "type": "story",
            "value": {
                "id": "ee8d2ca0-d4fb-11e9-b489-e9b807f15c0e",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": "Grachel takes the train",
                        "blockType": "image",
                        "mediaUrl": "./uploads/ee895c10-d4fb-11e9-b489-e9b807f15c0e.jpeg",
                        "alternativeText": "Grachel decides to take the train into Toronto to try and find a new restaurant. She's coming from the suburbs and isn't familiar with the TTC.",
                        "description": "Grachel decides to take the train into Toronto to try and find a new restaurant. She's coming from the suburbs and isn't familiar with the TTC.",
                        "fileDetails": {
                            "lastModified": 1568250242219,
                            "lastModifiedDate": "2019-09-12T01:04:02.219Z",
                            "name": "Train2.jpeg",
                            "size": 10524,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "A new world...",
                        "blockType": "image",
                        "mediaUrl": "./uploads/ee89d140-d4fb-11e9-b489-e9b807f15c0e.jpg",
                        "alternativeText": null,
                        "description": "As Grachel gets settled on the train, an anxiety overtakes her. She realizes she doesn't have the card necessary for payment, and she panics when she reviews the system map - and begins to try to navigate. She feels overwhelmed and a little scared!",
                        "fileDetails": {
                            "lastModified": 1568250747271,
                            "lastModifiedDate": "2019-09-12T01:12:27.271Z",
                            "name": "TTC.jpg",
                            "size": 63613,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "The train's other passengers...",
                        "blockType": "image",
                        "mediaUrl": "./uploads/ee8a1f60-d4fb-11e9-b489-e9b807f15c0e.jpg",
                        "alternativeText": "As she tries to manage her confusion, she gets a whiff of an old and musty smell. She looks around but sees nothing, until she peaks over the edge of the row of seats right in front of her. She finds a man sleeping. Right as her eyes settle on his resting body though, he stirs to wake - with wild eyes and a shudder. He jumped up and yelled - saliva going everywhere and the stench of unbrushed teeth billowing out like a mushroom cloud. Grachel popped up and ran as fast as she could to another car to finish her journey.",
                        "description": "As she tries to manage her confusion, she gets a whiff of an old and musty smell. She looks around but sees nothing, until she peaks over the edge of the row of seats right in front of her. She finds a man sleeping. Right as her eyes settle on his resting body though, he stirs to wake - with wild eyes and a shudder. He jumped up and yelled - saliva going everywhere and the stench of unbrushed teeth billowing out like a mushroom cloud. Grachel popped up and ran as fast as she could to another car to finish her journey.",
                        "fileDetails": {
                            "lastModified": 1568250403369,
                            "lastModifiedDate": "2019-09-12T01:06:43.369Z",
                            "name": "TTC-sleeping.jpg",
                            "size": 36686,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "Food, finally.",
                        "blockType": "image",
                        "mediaUrl": "./uploads/ee8a4670-d4fb-11e9-b489-e9b807f15c0e.jpeg",
                        "alternativeText": "After finally arriving into the city and getting off at the first stop that seemed safe, and withdrawing cash from an ATM in order to pay for a new transit card, Grachel exited the station and found a nearby food court. She wanted to try something new and different, and the food court featured a Nigerian restaurant that looked promising. But excitement quickly turned to frustration and a feeling of being overwhelmed - as the expansive menu was full of unfamiliar terms and pictures. After a few too many minutes of standing and staring blankly at list of various dishes, she turned and walked away - dejectedly heading for Tim Horton's and the safety of a turkey sandwich.",
                        "description": "After finally arriving into the city and getting off at the first stop that seemed safe, and withdrawing cash from an ATM in order to pay for a new transit card, Grachel exited the station and found a nearby food court. She wanted to try something new and different, and the food court featured a Nigerian restaurant that looked promising. But excitement quickly turned to frustration and a feeling of being overwhelmed - as the expansive menu was full of unfamiliar terms and pictures. After a few too many minutes of standing and staring blankly at list of various dishes, she turned and walked away - dejectedly heading for Tim Horton's and the safety of a turkey sandwich.",
                        "fileDetails": {
                            "lastModified": 1568251370430,
                            "lastModifiedDate": "2019-09-12T01:22:50.430Z",
                            "name": "nigerian food.jpeg",
                            "size": 164787,
                            "type": "image/jpeg"
                        }
                    }
                ],
                "title": "Grachel Goes to Town",
                "author": "Grachel + Joe",
                "tags": []
            }
        },
        "fa182c50-d640-11e9-9605-5d78aa190f9a":
        {
            "type": "story",
            "value": {
                "id": "fa182c50-d640-11e9-9605-5d78aa190f9a",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "Since the beginning of our time, my ancestors walked this land. I have always felt great comfort knowing that where my footsteps, my ancestors have also stepped in the same place, long ago. At one time we had full access to our land, water, and all that resided in and on it. We had access to all of our medicines, to our language, to our culture and ceremonies. We could stand on the water’s edge and drink directly from the shores, we had all that we needed to survive and thrive in our communities following the seasons, the sun the moon and the stars. We travelled freely along the lands surrounded by its comforts and bounty and were a greater part of that community, helping anyone in need and being part of that village. \n"
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl": "./uploads/fa119ca0-d640-11e9-9605-5d78aa190f9a.jpg",
                        "alternativeText": null,
                        "description": null,
                        "fileDetails": {
                            "lastModified": 1568317669045,
                            "lastModifiedDate": "2019-09-12T19:47:49.045Z",
                            "name": "inukshuk.jpg",
                            "size": 74764,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "Since the colonization of man, the connection to the earth has suffered. Where I was once able to put my feet in the water, I now have to stand on a pier looking over. Huge condo developments deny my access to it and it has become a commodity that has been privatized and commercialized. All the plant medicines have been replaced and colonized as well by plants and seeds from other lands. Concrete laying over these plants, the seeds have since gone to sleep. Where we were able to view the travels of the sun, the moon and the constellations, the buildings have grown taller and taller, fighting for real estate space in the sky, blockin out our access to it. Large trees have been replaced by much smaller ones and our access to green space has been denied. "
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl": "./uploads/fa11c3b0-d640-11e9-9605-5d78aa190f9a.jpg",
                        "alternativeText": null,
                        "description": null,
                        "fileDetails": {
                            "lastModified": 1568223364000,
                            "lastModifiedDate": "2019-09-11T17:36:04.000Z",
                            "name": "IMG_0012.jpg",
                            "size": 1787292,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl": "./uploads/fa145bc0-d640-11e9-9605-5d78aa190f9a.jpg",
                        "alternativeText": null,
                        "description": null,
                        "fileDetails": {
                            "lastModified": 1568223906000,
                            "lastModifiedDate": "2019-09-11T17:45:06.000Z",
                            "name": "IMG_0018.jpg",
                            "size": 337400,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "Losing access to our land and to the rhythm of the seasons has removed all empathy and compassion from us, as a whole, so that what we have done to the land, we are now doing to the people. We have become focused on development and economic growth at the detriment of the fringed society where we are made to feel invisible and unheard. When I walked through my neighbourhood, old storefronts that were once family owned, are now replaced with larger brand named stores that could afford the high rental rates. Cultural centers, Free Clinics and public access buildings were being relocated and replaced by starbucks, Tim Hortons, Urban Outfitters and other corporate entities, removed all the individuality that made up our neighbourhood affecting single mothers, refugees, All homeless, those with addictions and mental health affected communities. Access to Shelters, food banks, walk in clinics being replaced by private practices in a tiered healthcare system, shelters are moved to the suburbs, further denying basic human needs to the people that make up my community so that they have no choice but to move away. The green spaces that I enjoyed with my children growing up, became parking lots and then became condo developments, which only the rich can afford, making me feel like a stranger in my own neighborhood. \n\nAll that I have witnessed in my community is a direct result of colonization. The taking over of lands replacing inaccessible resources to those who cannot afford and gentrifying spaces making them inaccessible causes those that are affected by these changes to suffer as a result. As a single mother with three children, I cannot afford to move out of our one bedroom apartment and with all the development makes affordable housing a pipe dream. \n\nElder Jay Mason told me once, that there is nothing civilized about civilization and long after he is gone, I can see this for my own eyes. In the presence of urban development I see fragmentation of humanity, further marginalizing the most vulnerable and weak. Much like cement is paved over nature, I see the same happening to people. \n\nAs I walk the streets I see directly how the homeless are affected, how police presence is more prominent. How a homeless man is bullied because he had alcohol open in a park, gets a 300 dollar ticket and a six month ban from the park (his home) while they look the other way at all the public drinking that is available and even encouraged at street festivals and beer gardens, throughout the city. Buildings and public spaces are designed to make it impossible for those that are homeless to find a place to sleep, or segmented benches making laying down impossible. "
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl": "./uploads/fa14f800-d640-11e9-9605-5d78aa190f9a.jpg",
                        "alternativeText": null,
                        "description": null,
                        "fileDetails": {
                            "lastModified": 1568319477738,
                            "lastModifiedDate": "2019-09-12T20:17:57.738Z",
                            "name": "images.jpg",
                            "size": 11042,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "Police involvement is based on personal biases and even Indigenous police have been assimilated to the point where they are enforcing colonial laws against their own people for simply being visible. This makes me concerned, not only for our community that once was, but for the future of my children, that they will be scrutinized by the families and the children they grew up with are now afraid of them because of their socio-economic status. \n\nPolice involvement is based on personal biases and even Indigenous police have been assimilated to the point where they are enforcing colonial laws against their own people for simply being visible. This makes me concerned, not only for our community that once was, but for the future of my children, that they will be scrutinized by the families and the children they grew up with are now afraid of them because of their socio-economic status. \n\nIn one of my travels I came across a dandelion growing in the crack of the sidewalk and it reminded me of the resiliency of mother nature. How resilient our plant medicines are that even though we have long paved over them, the seeds have been asleep and are now waking up. It reminded me of the resiliency of humans and how we strive for that connection, and although we may only be a plant creeping up from a crack, underneath that sidewalk, our roots are connected to each other. Where the government has failed to help the people, I have seen the roots in the community grow and reach out to help eachother. \n"
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl": "./uploads/fa151f10-d640-11e9-9605-5d78aa190f9a.jpg",
                        "alternativeText": null,
                        "description": null,
                        "fileDetails": {
                            "lastModified": 1568319876651,
                            "lastModifiedDate": "2019-09-12T20:24:36.651Z",
                            "name": "plant.jpg",
                            "size": 167696,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "Where again those without monetary gain are usually the most charitable toothers in their community. Where government programs have failed, grassroots programs have thrived. People leading their own patrols, policing their own communities. Opening their doors, feeding the people and being that village. I have seen the outpour of kindness and generosity from those who have nothing because it is in their nature to give because they know what it feels to live without. \n\nThinking back to the uncivilized nature of civilization makes me wonder how can we improve the urban environment to include all. I am reminded of my traditional background and how I look towards how we survived without the amenities that now give us comfort. How when we think of smart city, my idea of smart doesn’t involve Electronic apps, or billboards with information, surveillance cameras everywhere and constant light and sound pollution. That all of these mess with our circadian rhythm, turning us into insomniacs and further harms those like my sons with autism, who have sensitivities to lights and sounds causing stress, overthinking and mental health issues due to constant information overload. \n"
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "A smart city for me would focus on sustainable living practices for all that improve our everyday living and the communities we live in. \n\nIncorporating more green spaces that are not only accessible to all, but also are affordable to all. Using rammed earth, strawbale, adobe, cobb, in our structures to reduce our strain on the environment. Making Internal walls out of recycled products like pop cans, plastic water and glass bottles so that they don’t end up in landfills. I think about how this type of housing would benefit all of my friends on the street and make affordable housing more accessable. How this type of thinking can benefit the design of a smart city which would create accessible homes for low income as well as for those that can afford market rate. A tiered building system so that each apartment can growtheir own food with passive solar windows and out door patios that encourage the owners to grow their own foods. Not only is affordable housing important, but it is also essential to change our ways of thinking so that different economic brackets can live side by side without stigma and judgement. That a smart city would embrace all public access. I dream that our public transportation would be tied into our tax system so that it would be free for all, or that it would be geared to income. So that it would be more equitable for people like me don’t have to pick between putting money on a presto card or feeding my children that week, just so that I can go to work to support my family. The idea of an equitable society is a true smart city, where it is accessible to your needs and not based on your socio-economic status. I see a community being supported like all aspects of the medicine wheel. That it would support the mental, emotional, physical, spiritual aspects that holistically support our well being. \n\nAll of those aspects of the human conditioning can be healed through greenspace. \nRemoving contained gardens and making them accessible to the people so that all Schools and buildings have greenhouses, where children can learn how to grow their own food and lunch and breakfast programs in the school can benefit from it. As well as nuturing the childs connection to nature. All green spaces contained lush gardens that can provide nourishment as well as stimulation to the senses. I see a community of food gardens, Healing gardens, fruit trees, edible flowers making food accessible to all. This is the way to moving towards a smart city, and to bring the idea of civilized, back to civilization. \n"
                    }
                ],
                "title": "smart city, bringing back civilized to civilization. ",
                "author": "Cathy Walker",
                "tags": [
                    "Gentrification. Greenspace."
                ]
            }
        }
    }
});
