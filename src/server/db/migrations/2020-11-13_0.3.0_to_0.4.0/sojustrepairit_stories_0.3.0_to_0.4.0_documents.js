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
        "2355da60-f11f-11e9-9409-319b90678833": {
            "type": "story",
            "value": {
                "id": "2355da60-f11f-11e9-9409-319b90678833",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "In May 2018, a group of high school students from Fresno, a small town in the mountains of Colombia, visited the city of Medellín for the first time. They traveled 7 hours by bus to participate in a 3 days event to share experiences and ideas with a group of young women that are interested in sovereignty, technologies, and gender. "
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "Arriving at Medellín",
                        "blockType": "image",
                        "mediaUrl": "./uploads/22d511a0-f11f-11e9-9409-319b90678833.jpg",
                        "alternativeText": "A group of people (4 adults and 2 teenagers) are showing to the camera a box full of fruits and groceries. ",
                        "description": "A group of people is showing to the camera a box full of fruits and groceries. ",
                        "fileDetails": {
                            "lastModified": 1571344794000,
                            "lastModifiedDate": "2019-10-17T20:39:54.000Z",
                            "name": "A_imagen1_llegada_medellin.jpg",
                            "size": 601955,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "All the details were ready for this great encounter between two generations of young people with very different contexts and backgrounds. The venue for this event was the house of Platohedro, a very special place where art and technologies are the bases to create collaborative and experimental projects.\n\nThe group of young women from Medellín has a project named “Motivando a la Gyal” (M.A.G)*. A women-led platform that runs a Festival every year. M.A.G group was nervous because this was the first time they prepare an activity like this, an activity for a group of young people that came from the countryside. They wanted to offer an amazing agenda to the boys and girls from Fresno, so they can feel comfortable, safe and happy. And that was exactly what happened. "
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "Gender workshop",
                        "blockType": "image",
                        "mediaUrl": "./uploads/22d5fc00-f11f-11e9-9409-319b90678833.jpg",
                        "alternativeText": "A group of people is listening to a person that is talking to them. The groups is sat and look calm.",
                        "description": "A group of people is listening to a person that is talking to them. ",
                        "fileDetails": {
                            "lastModified": 1571344918000,
                            "lastModifiedDate": "2019-10-17T20:41:58.000Z",
                            "name": "B_talleres_genero.jpg",
                            "size": 1489338,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "During 3 days they realized that all of them want it to take care of the environment and that they are working on that though their projects in the school and with the Festival."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "Orchards",
                        "blockType": "image",
                        "mediaUrl": "./uploads/22d7a9b0-f11f-11e9-9409-319b90678833.JPG",
                        "alternativeText": "A group of people is surrounding an orchard. They mostly women. Some of them look like they are talking, some are standing with their cell phones.",
                        "description": "A group of people is surrounding an orchard",
                        "fileDetails": {
                            "lastModified": 1571344960000,
                            "lastModifiedDate": "2019-10-17T20:42:40.000Z",
                            "name": "C_huerta.JPG",
                            "size": 2563179,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "They visited the Manga Libre and other community orchards in Medellín and share knowledge about plants, herbs and about products like “panela” that are produced from sugarcane. The young girls from M.A.G were surprised about all the knowledge that the students from Fresno have about the work on the farms. For the students, the idea of having an orchard in the middle of the city was surprising as well because they are used to living in large extensions of land in a very rich and fertile territory."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "Panela",
                        "mediaUrl": "./uploads/22dba150-f11f-11e9-9409-319b90678833.mp4",
                        "alternativeText": null,
                        "description": "A woman and a young woman talked about why panela has different tones. ",
                        "blockType": "video",
                        "fileDetails": {
                            "lastModified": 1571345015000,
                            "lastModifiedDate": "2019-10-17T20:43:35.000Z",
                            "name": "D_explicacion_panela.mp4",
                            "size": 151267437,
                            "type": "video/mp4"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "During 3 days the participants of the event to share ideas about inclusiveness, gender, care, seeds, environment and learn a lot about the differences and the struggles that the people that live in the cities and those who live in the countryside have in common."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "Enjoying Medellín",
                        "blockType": "image",
                        "mediaUrl": "./uploads/235405a0-f11f-11e9-9409-319b90678833.png",
                        "alternativeText": "A black and white picture of a group of people, mostly young people that are playing around a water fountain.",
                        "description": "A group of people, mostly young people are playing around a water fountain.",
                        "fileDetails": {
                            "lastModified": 1571345061000,
                            "lastModifiedDate": "2019-10-17T20:44:21.000Z",
                            "name": "E_disfrutando_medellin.png",
                            "size": 397113,
                            "type": "image/png"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "A new planet was discovered during those 3 days. A planet of sharing, listening and exchanging. A planet that is a school. \n\n*slang for “girl”."
                    }
                ],
                "title": "A new planet discovered",
                "author": "",
                "tags": []
            }
        },
        "23a61a00-07d8-11ea-a5cf-99a2338da816": {
            "type": "story",
            "value": {
                "id": "23a61a00-07d8-11ea-a5cf-99a2338da816",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": "ENVIRONMENTAL GUARD IN 2016…",
                        "blockType": "text",
                        "text": "When the project began with the Environmental Guard, an institution was found with desires and dreams that were not developed, which from their possibilities were looking for ways to achieve them.\n\nWe wanted to reach communities and people who, due to the structural and resource conditions, were not able to educate and train Environmental Guards. For example, it was very difficult to educate and train young people in cities far from Cartagena or in other departments.\n\nFor this reason it was important to make use of technological tools that would facilitate this purpose."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "COLOMBIAN ENVIRONMENTAL GUARD",
                        "blockType": "image",
                        "mediaUrl": "./uploads/2397c220-07d8-11ea-a5cf-99a2338da816.jpg",
                        "alternativeText": "Group of Environmental Guardians in the city of Cartagena de Indias.",
                        "description": "Group of Environmental Guardians in the city of Cartagena de Indias. This photo was taken in the Canapote neighborhood on July 20, 2015",
                        "fileDetails": {
                            "lastModified": 1572994316525,
                            "lastModifiedDate": "2019-11-05T22:51:56.525Z",
                            "name": "1.jpg",
                            "size": 314497,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "Video of the Colombian Environmental Guard",
                        "blockType": "text",
                        "text": "[https://youtu.be/6ugHF1YqNWc](https://youtu.be/6ugHF1YqNWc)"
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "WHAT WE ACHIEVE WITH SJRK",
                        "blockType": "text",
                        "text": "We want to tell you the most important thing we have built together with the SJRK project team:\n\nFirst, we created the web page http://guardiaambiental.org/ with custom visualization tools that have allowed us to show what we do in a digital range with more influence and for all people, being an accessible page.\n\nThe introduction of technological tools such as the MOOC and the visualization of environmental data of the city of Cartagena on the website has allowed us to expand the number of young people interested and trained as Environmental Guards who are providing management in the recovery of their environment.\n\nThe production of videos in Cuentalo, a very rewarding experience, by which we got to know stories and experiences of our young people who for many years were developing environmental guard activities, but we did not know why they were interested and, beyond that, all the social and family conditions to which they had been exposed.\n\nThe inclusion workshops, which taught us how we can make it easier for all people, including those with disabilities, to develop activities that recover and conserve the environment.\n\nThe internationalization of the Environmental Guard, through the visibility of the activities of the Guard in social media, the exchange of ideas and experiences with countries such as Italy, Brazil, Mexico, international visits to OCAD University in Toronto, by the Director Roberto Ruiz and the General Coordinator of Volunteers Elbert Rocha and the planning of a project to establish the Environmental Guard in Canada."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl": "./uploads/239921b0-07d8-11ea-a5cf-99a2338da816.png",
                        "alternativeText": null,
                        "description": null,
                        "fileDetails": {
                            "lastModified": 1572994319681,
                            "lastModifiedDate": "2019-11-05T22:51:59.681Z",
                            "name": "2.png",
                            "size": 5322159,
                            "type": "image/png"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "How the Colombian Environmental Guard works",
                        "blockType": "text",
                        "text": "[https://youtu.be/X_Fw2Ud1cms](https://youtu.be/X_Fw2Ud1cms)"
                    }
                ],
                "title": "Story of the participation of the Colombian Environmental Guard in the SJRK project",
                "author": "",
                "tags": [
                    "Guardia Ambiental",
                    "SJRK",
                    "Cartagena",
                    "Environmental Guard"
                ]
            }
        },
        "525c1950-f09d-11e9-8299-d34aa606fc6a": {
            "type": "story",
            "value": {
                "id": "525c1950-f09d-11e9-8299-d34aa606fc6a",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "Salimos de fresno a la 1:00 am el dia jueves, descansamos un poco en el camino nos dieron refrigerio luego llegamos a medellín a las 8:30 am, tuvimos un paseo visitando varios espacios de medellín muy maravillosos, luego del paseo fuimos a platohedro un lugar maravilloso donde hay personas super maravillosas que no recibieron con gran cariño nos atendieron de una manera muy agradable. Hoy dia viernes tuvimos un taller para tener creatividad y conocimiento donde las pasamos muy chevere y tuvimos una conexion con una chica de cartagena llamada natalia."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl": "./uploads/5258e500-f09d-11e9-8299-d34aa606fc6a.jpg",
                        "alternativeText": null,
                        "description": null,
                        "fileDetails": {
                            "lastModified": 1571289126992,
                            "lastModifiedDate": "2019-10-17T05:12:06.992Z",
                            "name": "1.jpg",
                            "size": 129499,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl": "./uploads/52593320-f09d-11e9-8299-d34aa606fc6a.jpg",
                        "alternativeText": null,
                        "description": null,
                        "fileDetails": {
                            "lastModified": 1571289131489,
                            "lastModifiedDate": "2019-10-17T05:12:11.489Z",
                            "name": "2.jpg",
                            "size": 106676,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl": "./uploads/5259f670-f09d-11e9-8299-d34aa606fc6a.jpg",
                        "alternativeText": null,
                        "description": null,
                        "fileDetails": {
                            "lastModified": 1571289134884,
                            "lastModifiedDate": "2019-10-17T05:12:14.884Z",
                            "name": "3.jpg",
                            "size": 80795,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl": "./uploads/525a4490-f09d-11e9-8299-d34aa606fc6a.jpg",
                        "alternativeText": null,
                        "description": null,
                        "fileDetails": {
                            "lastModified": 1571289137984,
                            "lastModifiedDate": "2019-10-17T05:12:17.984Z",
                            "name": "4.jpg",
                            "size": 78825,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl": "./uploads/525a92b0-f09d-11e9-8299-d34aa606fc6a.jpg",
                        "alternativeText": null,
                        "description": null,
                        "fileDetails": {
                            "lastModified": 1571289141817,
                            "lastModifiedDate": "2019-10-17T05:12:21.817Z",
                            "name": "5.jpg",
                            "size": 91466,
                            "type": "image/jpeg"
                        }
                    }
                ],
                "title": "Viaje a Medellín",
                "author": "grupo Real campestre la sagrada familia \"Fresno Tolima\"",
                "tags": [
                    "Medellín",
                    "platohedro"
                ]
            }
        },
        "529a3ce0-f123-11e9-9409-319b90678833": {
            "type": "story",
            "value": {
                "id": "529a3ce0-f123-11e9-9409-319b90678833",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": "CONTEXTUALIZACIÓN",
                        "blockType": "text",
                        "text": "La ciudad de Cartagena – Colombia, cuenta con una población cercana a 1.036.412 habitantes según la proyección de población municipal por área desarrollada por el DANE, de los cuales 269.442 son jóvenes entre 14 y 28 años, quienes representan el 26,29% de la población general. Destacamos que la mayoría de estos jóvenes son afrodescendiente y la mayoría desconoce los niveles de realización de sus derechos, viviendo situaciones de desigualdad e injusticia social.\n\nEn el proyecto social justice repair kit buscamos entonces dar a conocer la diversidad social en la ciudad de Cartagena a través de la narración de historias de vidas significativas y positivas de jóvenes que viven en la ciudad, y en este sentido, fue muy importante contactar a los jóvenes, grupos u organizaciones juveniles que desarrollaran un activismo social, cultural o político en la ciudad.\n\nPara el proyecto no fue fácil identificar las organizaciones o grupos juveniles que desarrollan un activismo cultural, social o político en la ciudad. Por una parte, las institución del gobierno encargada de trabajar con los jóvenes no tenía en ese momento una base de datos con la información actualizada de los jóvenes, nos tocó utilizar la técnica bola de nieve partiendo de la información que teníamos de algunos grupos o jóvenes contactados, los que nos referían a otros y así logramas contactar varios de ellos. Esta situación le dio relevancia a las acciones desarrolladas desde el proyecto y pensar acciones que contribuyan a subsanar ese problema ..*la falta de información (oportuna, veraz, confiable) acerca de los grupos juveniles de la ciudad.."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "CONTANDO LAS HISTORIAS",
                        "blockType": "text",
                        "text": "Los jóvenes que contaron sus historias tienen en común situaciones de desigualdad social y política, y para hacer frente a esto movilizan recursos propios y comunitarios para promover la garantía de derechos de los jóvenes de su comunidad. Esta labor que no es fácil, es producto de la fragmentación y polarización social manifiesta por la apatía e indiferencia de algunos jóvenes frente a la defensa de sus derechos. \n\nPor lo anterior los jóvenes reconocen en contar sus historias una herramienta valiosa para dar a conocer que somos diferentes, reconociendo en el otro experiencias de vida que le permitieron salir adelante a pesar de las dificultades o problemas, siendo inspirador para otros jóvenes.\n\nPara dar visibilidad a las historias desde el proyecto se creó una plataforma virtual que se llama “cuéntalo.org” posibilitando tener datos oportunos y confiables de los jóvenes u organizaciones juveniles que desarrollan un activismo social, dando a conocer el tipo de actividad que realizan, población con la que trabajan, ubicación entre otras.."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "APRENDIZAJES",
                        "blockType": "text",
                        "text": "En el desarrollo del proyecto aprendimos la importancia de la articulación de las diferentes disciplinas en la consecución de un objetivo en común y en este caso de carácter social… profesionales en la realización audiovisual, ingeniería de sistemas, psicología entre otros articulamos saberes en la identificación, formulación y elaboración de las historias siendo los jóvenes protagonistas activos y el eje central articulados de las acciones …"
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "Social Justice Repair Kit",
                        "blockType": "text",
                        "text": "Presentación del equipo SJRK\n[https://www.youtube.com/watch?v=1fxQqDWaDW8&t=6s](https://www.youtube.com/watch?v=1fxQqDWaDW8&t=6s)"
                    }
                ],
                "title": "SJRK CARTAGENA, our story …. ",
                "author": "Amaury",
                "tags": []
            }
        },
        "58159990-f76c-11e9-9f47-0d8885ce50a7": {
            "type": "story",
            "value": {
                "id": "58159990-f76c-11e9-9f47-0d8885ce50a7",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "Throughout the SJRK project, our organization has collaborated with many initiatives that are advancing programming for people with disabilities. Designing inclusively, to support people who have different needs than your own can be challenging, as sometimes differing needs and the accommodations to overcome them may not be obvious. Being open, collaborative, humble and iterative can help when there is no good way to anticipate how to ensure delivery in an inclusive way.\n\nOne story I have in this realm relates to a training that I conducted for 40 deaf language instructors as part of a collaborative training program. As a very novice practitioner of ASL and one of the very few hearing people in the room, it was fascinating to experience a context where the medical model of disability (where “the individual is seen as the problem”) and the social model of disability (where “social barriers are the problem”) was so apparent to me. \n\nI, for the first time in my experience, was very much disadvantaged by the context, a community of folks who I had previously understood to be at a disadvantage. Here, in the room, my inability to understand ASL put me at a disadvantage in being able to communicate with and understand the community of ASL native speakers.\n\nThere were interpreters available, which were heavily relied upon to both understand and respond to questions and content throughout the training.\n\nThis training flipped me and my perspective on my head. I walked into the room as a hearing person, and left the room as an incompetent user of ASL. The difference was merely a change of perspective. I was very appreciative of the opportunity to learn, share and engage with the deaf community and I revealed so much about my own assumptions through the experience. \n"
                    }
                ],
                "title": "Medical and Social models",
                "author": "TIG",
                "tags": [
                    "SJRK",
                    "TIG",
                    "medical model",
                    "social model"
                ]
            }
        },
        "65651980-f146-11e9-9409-319b90678833": {
            "type": "story",
            "value": {
                "id": "65651980-f146-11e9-9409-319b90678833",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": "Remembering What It's All For",
                        "blockType": "text",
                        "text": "Working with partners far and wide on the SJRK project has been a wonderful experience for me as I have learned so much about places, cultures and contexts that were previously unfamiliar to me. I am grateful to be able to use technology to stay connected with one another, but coming together in the same place is always a powerful reminder for me of why this work is important. Gathering together in the same room, as we did today, to share stories about the project and to reflect on our successes and challenges has reinvigorated me and made me excited to start scheming about what will come next!"
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl": "./uploads/656085a0-f146-11e9-9409-319b90678833.jpg",
                        "alternativeText": "A photo of a group of 9 people standing, sitting and squatting against a white wall, with two drawings on brown paper taped to the wall behind them.",
                        "description": "Group photo (with guest \"creatures\"), SJRK face to face meeting, October 17, 2019",
                        "fileDetails": {
                            "lastModified": 1571361062324,
                            "lastModifiedDate": "2019-10-18T01:11:02.324Z",
                            "name": "group photo oct 17 2019.jpg",
                            "size": 277789,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "Gratitude",
                        "blockType": "text",
                        "text": "I'm grateful to all of the partners for bringing your incredible knowledge and experience to this project, and for your willingness to enter into an unknown space with us where we could explore possibilities together. Congratulations to all for a successful project!"
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl": "./uploads/656148f0-f146-11e9-9409-319b90678833.jpg",
                        "alternativeText": "A photo of people sitting in a circle, including an image of someone on a large computer screen and one person standing up, in a room with a red wall and red carpet.",
                        "description": "Face to face meeting discussion",
                        "fileDetails": {
                            "lastModified": 1571361559094,
                            "lastModifiedDate": "2019-10-18T01:19:19.094Z",
                            "name": "group action shot 1.jpg",
                            "size": 279969,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl": "./uploads/6561e530-f146-11e9-9409-319b90678833.jpg",
                        "alternativeText": "A photo of people sitting in a circle in a room with a red wall and red carpet.",
                        "description": "Face to face meeting discussion ",
                        "fileDetails": {
                            "lastModified": 1571361580137,
                            "lastModifiedDate": "2019-10-18T01:19:40.137Z",
                            "name": "group action shot 2.jpg",
                            "size": 301513,
                            "type": "image/jpeg"
                        }
                    }
                ],
                "title": "What It's All About",
                "author": "Dana ",
                "tags": [
                    "SJRK",
                    "partners",
                    "collaboration",
                    "international",
                    "gratitude",
                    "exploration"
                ]
            }
        },
        "6770a110-00d5-11ea-addf-fb8afee817da": {
            "type": "story",
            "value": {
                "id": "6770a110-00d5-11ea-addf-fb8afee817da",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "We left Fresno at 1:00 AM on Thursday, we rested a little on the road, they gave us refreshments, then we arrived in Medellin at 8:30 AM. We had a walk visiting several very wonderful areas of Medellin. After the walk we went to platohedro, a wonderful place where there are super wonderful people who received us with great affection and attended to us in a very nice way. Today, Friday, we had a workshop to promote creativity and knowledge where we had a great time and made a connection with a girl from Cartagena called Natalia."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl": "./uploads/676b9800-00d5-11ea-addf-fb8afee817da.jpg",
                        "alternativeText": null,
                        "description": null,
                        "fileDetails": {
                            "lastModified": 1572992844269,
                            "lastModifiedDate": "2019-11-05T22:27:24.269Z",
                            "name": "1.jpg",
                            "size": 129499,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl": "./uploads/676c5b50-00d5-11ea-addf-fb8afee817da.jpg",
                        "alternativeText": null,
                        "description": null,
                        "fileDetails": {
                            "lastModified": 1572992847717,
                            "lastModifiedDate": "2019-11-05T22:27:27.717Z",
                            "name": "2.jpg",
                            "size": 106676,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl": "./uploads/676cd080-00d5-11ea-addf-fb8afee817da.jpg",
                        "alternativeText": null,
                        "description": null,
                        "fileDetails": {
                            "lastModified": 1572992851527,
                            "lastModifiedDate": "2019-11-05T22:27:31.527Z",
                            "name": "3.jpg",
                            "size": 80795,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl": "./uploads/676d1ea0-00d5-11ea-addf-fb8afee817da.jpg",
                        "alternativeText": null,
                        "description": null,
                        "fileDetails": {
                            "lastModified": 1572992856800,
                            "lastModifiedDate": "2019-11-05T22:27:36.800Z",
                            "name": "4.jpg",
                            "size": 78825,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl": "./uploads/676d93d0-00d5-11ea-addf-fb8afee817da.jpg",
                        "alternativeText": null,
                        "description": null,
                        "fileDetails": {
                            "lastModified": 1572992860051,
                            "lastModifiedDate": "2019-11-05T22:27:40.051Z",
                            "name": "5.jpg",
                            "size": 91466,
                            "type": "image/jpeg"
                        }
                    }
                ],
                "title": "Trip to Medellin",
                "author": "grupo Real campestre la sagrada familia \"Fresno Tolima\"",
                "tags": [
                    "Medellín",
                    "platohedro"
                ]
            }
        },
        "6fa874c0-f11c-11e9-9409-319b90678833": {
            "type": "story",
            "value": {
                "id": "6fa874c0-f11c-11e9-9409-319b90678833",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "Ivan de la Montaña, thought of a workshop for young people to know where they lived, what were the stories that surrounded them as a community, and why it was important to know them. Using a map and activities, young people would know more about Fresno."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "In the workshop",
                        "blockType": "image",
                        "mediaUrl": "./uploads/6f5ffa10-f11c-11e9-9409-319b90678833.png",
                        "alternativeText": "A group of students sitting in a semi-circle, and one teacher. Some of them have their hands over their faces, others have their eyes closed.",
                        "description": "The workshop in progress. Students are deep in thought.",
                        "fileDetails": {
                            "lastModified": 1571343680000,
                            "lastModifiedDate": "2019-10-17T20:21:20.000Z",
                            "name": "Taller 1 Toronto.png",
                            "size": 774725,
                            "type": "image/png"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "Alejandra is a restless woman, curious, full of life, with many ideas. She was making with her cell phone and little budget, audiovisual material about Fresno, . She showed us a documentary she was doing to show the territory."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "lecturer and map",
                        "blockType": "image",
                        "mediaUrl": "./uploads/6f61f5e0-f11c-11e9-9409-319b90678833.png",
                        "alternativeText": "The left side of the image has a man’s face with some green mountains in the background. On the right side is a hand-drawn map showing the region of Tulaymá",
                        "description": "Lecturer and map used in the workshop",
                        "fileDetails": {
                            "lastModified": 1571343741000,
                            "lastModifiedDate": "2019-10-17T20:22:21.000Z",
                            "name": "taller 2 Toronto.png",
                            "size": 864454,
                            "type": "image/png"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "We asked both of them to do an audiovisual workshop where they would teach young people to develop ideas using what they had. Show that technology was available, they could use the cell phone, to which many had access, to tell a story. They would have to meet, think of an idea, develop it and then take advantage of the Local network to spread it."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "Cellphone and recording",
                        "blockType": "image",
                        "mediaUrl": "./uploads/6f63a390-f11c-11e9-9409-319b90678833.png",
                        "alternativeText": "A cellular phone being used to capture a photo of a small sculpture of a person made out of plant material and wire.",
                        "description": "Cellphone recording image",
                        "fileDetails": {
                            "lastModified": 1571343793000,
                            "lastModifiedDate": "2019-10-17T20:23:13.000Z",
                            "name": "taller 3 Toronto.png",
                            "size": 784681,
                            "type": "image/png"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "Alejandra finishes the workshop and immediately the students tell her that they have an idea about a short film in which they want to teach the rest of the school about bullying, leaving the short in the Local Network so that the other students can see it. They ask you not to leave because they would like you to help them, it is 2:00 pm in the afternoon and the last bus leaves at 4:00 pm. Alejandra does not doubt it and tells them that time must be planned.\n\nFinally, jointly they create a script, share the characters, share roles and start recording, create “ El Pecas” (The \"Freckles\")."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "Video Pecas",
                        "mediaUrl": "./uploads/6f64dc10-f11c-11e9-9409-319b90678833.mp4",
                        "alternativeText": null,
                        "description": "Video about bullying",
                        "blockType": "video",
                        "fileDetails": {
                            "lastModified": 1571343858000,
                            "lastModifiedDate": "2019-10-17T20:24:18.000Z",
                            "name": "Taller 4 PECAS.mp4",
                            "size": 51477992,
                            "type": "video/mp4"
                        }
                    }
                ],
                "title": "Audiovisual Workshop",
                "author": "",
                "tags": []
            }
        },
        "7810c740-f11a-11e9-9409-319b90678833": {
            "type": "story",
            "value": {
                "id": "7810c740-f11a-11e9-9409-319b90678833",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "I joined the IDRC in July of 2017, shortly after the start of the SJRK project. I've been the primary developer of the Storytelling Tool in collaboration with at least a half-dozen other developers and designers. The evolution of the tool over the last two and a bit years has given me a greater appreciation for the challenges of designing and developing a web app that was as inclusive and accessible as possible, both in terms of its use and also its creation.\n\nPart of this creation was in fact co-creation and co-design along with the various SJRK partners around the globe. I learned about the invaluable benefit of gathering a diversity of perspectives and experiences, and that no one designer or developer could possibly know what will work best for every user. I heard about students in Rwanda with learning differences; a group youth movement in Colombia that taught others to care for their local environment; another group in Colombia developing a wide area network where there was little to no connectivity to the broader internet; setting up an online high school in Mexico for students who would otherwise not be able to attend; a team teaching youth in Canada's North how to use video cameras and drones to share their experiences."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl": "./uploads/780b7010-f11a-11e9-9409-319b90678833.png",
                        "alternativeText": "A very basic web design consisting primarily of a page title, a large text input box and a button that says \"Done\", all in black on a white background",
                        "description": "One of the first designs of The Storytelling Tool",
                        "fileDetails": {
                            "lastModified": 1571342652000,
                            "lastModifiedDate": "2019-10-17T20:04:12.000Z",
                            "name": "2019-10-17 storytelling tool story - design 1.png",
                            "size": 36351,
                            "type": "image/png"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "Learning about all the amazing projects being supported was awe-inspiring. When I began to work on the Storytelling Tool, I had an abstract sense of what it would be used for, though I didn't know at that point the full breadth of work being done by the partner organizations. To find out that we were in the company of groups working so hard to improve the lives and access to education for young people was so inspiring, and gave me motivation to do my best in working on tool."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl": "./uploads/780bbe30-f11a-11e9-9409-319b90678833.png",
                        "alternativeText": "A simple web interface with no decorative elements consisting of a form with various fields. The fields include: \"story title\", \"your name\", a text input area, a drop-down list to indicate the language of the story and a text box to enter the language, and finally a button that says \"Done\" ",
                        "description": "An early prototype of the tool with basic multilingual features and only supporting text stories",
                        "fileDetails": {
                            "lastModified": 1571342674000,
                            "lastModifiedDate": "2019-10-17T20:04:34.000Z",
                            "name": "2019-10-17 storytelling tool story - tool 1.png",
                            "size": 56790,
                            "type": "image/png"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "A simple web interface with no decorative elements consisting of a form with various fields. The fields include: \"story title\", \"your name\", a text input area, a drop-down list to indicate the language of the story and a text box to enter the language, and finally a button that says \"Done\" "
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl": "./uploads/780c0c50-f11a-11e9-9409-319b90678833.png",
                        "alternativeText": null,
                        "description": "the first appearance of the \"block\" based authoring systema series of design mockups of the storytelling tool, each consisting of a title bar in yellow with a few buttons below it to add various types of block to the story. The icons on the buttons include a letter T, an image, a paintbrush, a microphone and a video camera. In further screens, a text area is present and an on-screen keyboard is shown",
                        "fileDetails": {
                            "lastModified": 1571342668000,
                            "lastModifiedDate": "2019-10-17T20:04:28.000Z",
                            "name": "2019-10-17 storytelling tool story - design 2.png",
                            "size": 195255,
                            "type": "image/png"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "There were times where I would get so deep into the weeds of the code that I lost sight of the end goal of creating a free, open-source, cheap to deploy content authoring tool. At these times, I found it incredibly motivating to remember who was going to be using the tool and the personal stories that we wanted people to be able to share with it."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl": "./uploads/780ccfa0-f11a-11e9-9409-319b90678833.png",
                        "alternativeText": "a full-screen web design with blue bars on the top and bottom of the screen, a logo of an open book with a heart set into it, and some supporting organization logos at the bottom. The main part of the screen is split vertically in two, with the left side showing some introductory text and the right side showing the block editing interface along with some sample content",
                        "description": "a more mature design of the storytelling tool along with some framing specific to the Learning Reflections project (outside of the SJRK)",
                        "fileDetails": {
                            "lastModified": 1571342670000,
                            "lastModifiedDate": "2019-10-17T20:04:30.000Z",
                            "name": "2019-10-17 storytelling tool story - design 3.png",
                            "size": 232883,
                            "type": "image/png"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "The development continues, and hopefully some day we will get some outside contributors who can carry on the work and help the tool grow to something more than we could ever imagine."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl": "./uploads/780e0820-f11a-11e9-9409-319b90678833.png",
                        "alternativeText": "a colourful version of the Storytelling Tool with a design that mimics the SJRK website, including the SJRK logo, the same dark blue accent colour and the multicolour confetti background",
                        "description": "The Storytelling Tool as it looks today",
                        "fileDetails": {
                            "lastModified": 1571342677000,
                            "lastModifiedDate": "2019-10-17T20:04:37.000Z",
                            "name": "2019-10-17 storytelling tool story - tool 2.png",
                            "size": 113440,
                            "type": "image/png"
                        }
                    }
                ],
                "title": "My SJRK memories",
                "author": "Gregor",
                "tags": [
                    "Memories",
                    "design",
                    "development"
                ]
            }
        },
        "8ea7d380-f03f-11e9-8299-d34aa606fc6a": {
            "type": "story",
            "value": {
                "id": "8ea7d380-f03f-11e9-8299-d34aa606fc6a",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "During the month of May, 8 workshops sponsored by the Karisma Foundation were held within the framework of the Opportunities for Rural Youth project. These workshops were distributed among 3 campuses of the institution; Main campus at Mirella (3 workshops), Las Marias (2 workshops) and Betania (3 workshops)."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "STOP MOTION",
                        "blockType": "text",
                        "text": "[![STOP MOTION](https://img.youtube.com/vi/t5rKFK3KC2Q/0.jpg)](https://www.youtube.com/watch?v=t5rKFK3KC2Q)"
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "Workshop Dynamics",
                        "blockType": "text",
                        "text": "The approach to the workshops was the same in each case, while each took a unique shape depending on the skills and interests of the group.\n\nFirst we started with a group presentation in which we shared our name, age, interests and dreams, then, under the inspiration of the projects we talked about the importance of communications and art in the world in which we find ourselves, and how web tools can open doors to embarking on the path of our future.\n\n[![STOP MOTION](https://img.youtube.com/vi/iR6D226g7v8/0.jpg)](https://www.youtube.com/watch?v=iR6D226g7v8)\n\nThe students were asked to write answers to the following questions on a sheet: Who I am? Where do I come from? Where am I going and what is my purpose? The idea was to answer these questions through a video made with the tools provided. The videos were to be posted on the platform under the name of Time Capsule, a project that aims to reinforce the vision that will allow children to develop in all areas of their lives, narrate their experiences, and plan for their future.\n\nSecondly, I shared about my work in The Chronicles of Juana, focusing on the strengths of mobile devices that we usually have at hand and with which we can do almost anything in creative and audiovisual terms.\n\nWithin the framework of these products, key issues arose at all stages of production such as: camera management and the importance of curiosity as the basis for a good photograph, types of plane and angles, interview techniques, body expression and linguistics, the use of music, image rights and authorship, editing work, and others.\n\nIt should be noted that it was not possible to explore all of these issues fully during the course of the 2-hour workshops, given the universe of details that make up a visual work. However, the students were left with a seed which can be germinated to help them find the best way to use the tools to meet their learning and creating needs.\n\n[![STOP MOTION](https://img.youtube.com/vi/4XnYqeYHwu0/0.jpg)](https://www.youtube.com/watch?v=4XnYqeYHwu0)\n\nIn one exercise we used StopMotion, which provides a simple and efficient technique of creation, to make a group animation. This allowed the students to see the ease with which they can carry out our creative ideas, and to live the experience of the world that moves behind the content they are receiving all the time through social networks. In this way they began to understand that they have everything they need to also be content generators.\n\n[![STOP MOTION](https://img.youtube.com/vi/HrlQTm2HFZw/0.jpg)](https://www.youtube.com/watch?v=HrlQTm2HFZw)\n \nTo close the workshop, they shared about creative tools such as FilmoraGo cell phone, MyMovie, Memes Creator, Gift Creator and DuRecorder, with which they have infinite possibilities to let their imagination fly."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "Mirella campus",
                        "blockType": "text",
                        "text": "On Thursday, May 16, I visited the main campus where I was kindly received at 8:00 am by Professor Giovanna. The first workshop was developed with the 9th grade students, and was based on my experience as a social communicator and journalist, and with the idea of strengthening and reinforcing the student’s creative skills in order to implement them within the framework of a real newscast. The workshop ended at 10:00 am. The second workshop ran from 10:15 am to 12:30 pm with the 8th grade students, and the closing workshop was held with grades 10 and 11 students between 1:00 and 3:30 pm.\n\n[![STOP MOTION](https://img.youtube.com/vi/h3OGP-w6o9g/0.jpg)](https://www.youtube.com/watch?v=h3OGP-w6o9g)\n\nTalents and strengths were identified among some of the students, who expressed interest in the path of communications (mostly YouTubers) as a latent possibility and need for their near futures."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "Taller Crearte Comunicativo I",
                        "blockType": "text",
                        "text": "[![Taller Crearte Comunicativo I](https://img.youtube.com/vi/nl56d4Re66o/0.jpg)](https://www.youtube.com/watch?v=nl56d4Re66o)\n\nVideo: Audiovisual report of the experience. Example of a report as a recommendation to the real news program on the day."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "Las Marías campus",
                        "blockType": "text",
                        "text": "After a couple of hours in a jeep ride on an uncovered and rainy road, we arrived around 8:00 am at Las Marías School, where Professor Byron was waiting for us, and led us to a class of 9th grade boys who rose kindly before my arrival as a sign of greeting and respect. The workshop was held until 10:00 am, when the 8th grade boys arrived and with whom we continued until 12:00 pm.\n\n[![STOP MOTION](https://img.youtube.com/vi/-tgHtkV7vdI/0.jpg)](https://www.youtube.com/watch?v=-tgHtkV7vdI)\n\nI can say that the experience with these boys was one of the most inspiring, because their curiosity and willingness allowed the work to flow, such that with a couple of extra hours of meeting in the afternoon we were able to make a short film called \"Freckles\" with everyone's collaboration."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "Taller CreArte Comunicativo II. Las Marias",
                        "blockType": "text",
                        "text": "[![Taller CreArte Comunicativo II. Las Marias](https://img.youtube.com/vi/4B19EaQKEXA/0.jpg)](https://www.youtube.com/watch?v=4B19EaQKEXA)\n\nVideo: Short film \"Pecas\", about bullying."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "Betania campus",
                        "blockType": "text",
                        "text": "A sunny day awaited us on the Betania sidewalk, and the workshops with the 8th, 9th and 11th grades were efficiently developed thanks to the collaboration of the boys and especially of Professor Ruth and her daughter, who were kindly active and attentive from the reception to the end of the workshops.\n\n[![STOP MOTION](https://img.youtube.com/vi/hx01EvbhYew/0.jpg)](https://www.youtube.com/watch?v=hx01EvbhYew)\n\nIt was a busy day - together with the boys we applied what they learned and in the afternoon we carried out an activity to recover the historical memory of the district. About 25 boys stayed to give continuity to the process; they held interviews, filmed the spaces, photographed curiosities and in this way explored and applied their new skills.\n\nVideo: Chronicle in Betania, Denunciation of Problems\n\n[![STOP MOTION](https://img.youtube.com/vi/cKw6KEJLPv4/0.jpg)](https://www.youtube.com/watch?v=cKw6KEJLPv4)"
                    }
                ],
                "title": "YOU CREATE, COMMUNICATE Creativity workshop applied to communication.",
                "author": "",
                "tags": []
            }
        },
        "98beb190-f107-11e9-9409-319b90678833": {
            "type": "story",
            "value": {
                "id": "98beb190-f107-11e9-9409-319b90678833",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": "GUARDIA AMBIENTAL EN EL 2016….",
                        "blockType": "text",
                        "text": "En ese momento cuando se inició el proyecto con la guardia ambiental, se encontro una institución en condiciones con deseos y sueños sin desarrollar, que desde sus posibilidades buscaban la manera de lograrlos.\n\nQueríamos llegar a las comunidades y personas que por las condiciones estructurales y de recursos no estaban al alcance para formarse y capacitarse como guardia ambiental. Por ejemplo, era muy difícil formar y capacitar jóvenes en ciudades lejanas de Cartagena y en otros departamentos.\n\nPor esto era importante hacer uso de herramientas tecnológicas que nos facilitaran este fin.\n"
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "GUARDIA AMBIENTAL COLOMBIANA",
                        "blockType": "image",
                        "mediaUrl": "./uploads/98b11d00-f107-11e9-9409-319b90678833.jpg",
                        "alternativeText": "Grupo de Guardianes Ambientales en la ciudad de Cartagena de Indias.",
                        "description": "Grupo de Guardianes Ambientales en la ciudad de Cartagena de Indias.\nEsta foto fue tomada en el barrio de Canapote el 20 de julio 2015",
                        "fileDetails": {
                            "lastModified": 1571327848000,
                            "lastModifiedDate": "2019-10-17T15:57:28.000Z",
                            "name": "20157201_1711438219153181_3460593115461091793_o.jpg",
                            "size": 314497,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "LO QUE LOGRAMOS CON SJRK",
                        "blockType": "text",
                        "text": "Queremos contarles lo más importante que hemos construido junto al equipo del proyecto SJRK:\n\nComenzando por decirles que creamos la Pagina Web http://guardiaambiental.org/ con herramientas de visualizacion personalizada que nos ha permitido mostrar lo que hacemos en una gama digital con más influencia y para todas las personas por ser una página accesible.\n\nLa introducción de la herramientas Tecnológicas como los mooc y la visualización de datos ambientales de la ciudad de Cartagena en la Página Web, lo que nos ha permitido ampliar el número de jóvenes interesados y capacitados como Guardias Ambientales que están aportando Gestiones en la recuperación de su entorno.\n\nLa realización de Videos en Cuentalo, una experiencia muy gratificante, porque de esta manera llegamos a conocer historias y vivencias de nuestro jóvenes que por muchos años estaban desarrollando actividades de guardia Ambiental, pero no conocíamos del porqué de su interes y mas aun de toda esas condiciones sociales y familiares a las que habían estado expuestos.\n\nLos talleres de inclusión, que nos enseñaron de qué manera podemos facilitar que todas las personas incluyendo aquellas con discapacidad, desarrollen actividades que recuperen y conserven el medio ambiente.\n\nLa internacionalización de la Guardia Ambiental, a través de la visibilización de las actividades de la Guardia en medios sociales, el intercambios de ideas y experiencias con países como Italia, Brasil, México, las visitas internacionales a la Universidad OCAD Toronto, por parte del Director Roberto Ruiz y el coordinador General de Voluntarios Elbert Rocha y la planificación de un proyecto que permita establecer la Guardia Ambiental en Canadá.\n"
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl": "./uploads/98b27c90-f107-11e9-9409-319b90678833.png",
                        "alternativeText": null,
                        "description": null,
                        "fileDetails": {
                            "lastModified": 1571328574000,
                            "lastModifiedDate": "2019-10-17T16:09:34.000Z",
                            "name": "Screen Shot 2019-10-17 at 12.09.33 PM.png",
                            "size": 5322159,
                            "type": "image/png"
                        }
                    }
                ],
                "title": "Historia de la participacion de la Guardia Ambiental Colombiana en el proyecto SJRK",
                "author": "",
                "tags": [
                    "Guadia Ambiental",
                    "SJRK",
                    "Cartagena"
                ]
            }
        },
        "999307d0-f123-11e9-9409-319b90678833": {
            "type": "story",
            "value": {
                "id": "999307d0-f123-11e9-9409-319b90678833",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": "GUARDIA AMBIENTAL EN EL 2016….",
                        "blockType": "text",
                        "text": "En ese momento cuando se inició el proyecto con la guardia ambiental, se encontro una institucion en condiciones con deseos y sueños sin desarrollar, que desde sus posibilidades buscaban la manera de lograrlos.\n\nQueríamos llegar a las comunidades y personas que por las condiciones estructurales y de recursos no estaban al alcance para formarse y capacitarse como guardia ambiental. Por ejemplo, era muy difícil formar y capacitar jóvenes en ciudades lejanas de cartagena y en otros departamentos.\n\nPor esto era importante hacer uso de herramientas tecnológicas que nos facilitaran este fin."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "Video de la Guardia Ambiental Colombiana",
                        "blockType": "text",
                        "text": "[https://youtu.be/6ugHF1YqNWc](https://youtu.be/6ugHF1YqNWc)"
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "LO QUE LOGRAMOS CON SJRK",
                        "blockType": "text",
                        "text": "Queremos contarles lo más importante que hemos construido junto al equipo del proyecto SJRK:\n\nComenzando por decirles que creamos la Pagina Web http://guardiaambiental.org/ con herramientas de visualizacion personalizada que nos ha permitido mostrar lo que hacemos en una gama digital con más influencia y para todas las personas por ser una página accesible.\n\nLa introducción de la herramientas Tecnológicas como los mooc y la visualización de datos ambientales de la ciudad de Cartagena en la Página Web, lo que nos ha permitido ampliar el número de jóvenes interesados y capacitados como Guardias Ambientales que están aportando Gestiones en la recuperación de su entorno.\n\nLa realización de Videos en Cuentalo, una experiencia muy gratificante, porque de esta manera llegamos a conocer historias y vivencias de nuestro jóvenes que por muchos años estaban desarrollando actividades de guardia Ambiental, pero no conocíamos del porqué de su interes y mas aun de toda esas condiciones sociales y familiares a las que habían estado expuestos.\n\nLos talleres de inclusión, que nos enseñaron de qué manera podemos facilitar que todas las personas incluyendo aquellas con discapacidad, desarrollen actividades que recuperen y conserven el medio ambiente.\n\nLa internacionalización de la Guardia Ambiental, a través de la visibilización de las actividades de la Guardia en medios sociales, el intercambios de ideas y experiencias con países como Italia, Brasil, México, las visitas internacionales a la Universidad OCAD Toronto, por parte del Director Roberto Ruiz y el coordinador General de Voluntarios Elbert Rocha y la planificación de un proyecto que permita establecer la Guardia Ambiental en Canadá."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "Como trabaja la Guardia aAmbiental Colombiana",
                        "blockType": "text",
                        "text": "[https://youtu.be/X_Fw2Ud1cms](https://youtu.be/X_Fw2Ud1cms)"
                    }
                ],
                "title": "GUARDIA IN SJRK",
                "author": "",
                "tags": []
            }
        },
        "a1956530-f124-11e9-9409-319b90678833": {
            "type": "story",
            "value": {
                "id": "a1956530-f124-11e9-9409-319b90678833",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl": "./uploads/a18d4ee0-f124-11e9-9409-319b90678833.jpg",
                        "alternativeText": "Mural on a school of trees, sun, clouds, birds and a rainbow made of brightly coloiured plastic bottle caps",
                        "description": "Mural made of bottle caps",
                        "fileDetails": {
                            "lastModified": 1571347262000,
                            "lastModifiedDate": "2019-10-17T21:21:02.000Z",
                            "name": "1 Mural.jpg",
                            "size": 554269,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "Participating in the Social Justice Repair Kit project was an incredibly rewarding experience. The project showed concretely how much impact we can have on youth in various countries and contexts when we give agency to community groups who are close to and working with youth.\n\nThe ingenuity of the project teams resulted in so many different ideas and implementations - things that worked for particular groups and inspired new ideas for other groups."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "SJRK Resources",
                        "blockType": "image",
                        "mediaUrl": "./uploads/a18f71c0-f124-11e9-9409-319b90678833.png",
                        "alternativeText": "Many brightly coloured sticky notes on a red wall. There is writing on the sticky notes but it’s not legible. ",
                        "description": "Resources created and used by partners in the Social Justice Repair Kit",
                        "fileDetails": {
                            "lastModified": 1571347293000,
                            "lastModifiedDate": "2019-10-17T21:21:33.000Z",
                            "name": "2 Resources.png",
                            "size": 1937466,
                            "type": "image/png"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "Just like in a collaborative surprise drawing, we combined our ideas in ways we didn’t plan and the results were unexpected."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "Collaborative surprise drawing",
                        "blockType": "image",
                        "mediaUrl": "./uploads/a1927f00-f124-11e9-9409-319b90678833.jpg",
                        "alternativeText": "Two drawings of fantastical creatures made collaboratively by the project team.",
                        "description": "Creatures drawn by the project team without knowing what the whole would look like.",
                        "fileDetails": {
                            "lastModified": 1571347323000,
                            "lastModifiedDate": "2019-10-17T21:22:03.000Z",
                            "name": "3 Collab.jpg",
                            "size": 243353,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "When we look at all the work we’ve done for our project, we see the similarities and differences and how the combination of pieces has created a greater whole."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "Bee House",
                        "blockType": "image",
                        "mediaUrl": "./uploads/a1934250-f124-11e9-9409-319b90678833.jpg",
                        "alternativeText": "A small house shaped structure with sections that are filled with various materials such as tiny bricks, pinecones and sticks where bees can nest.",
                        "description": "Home for native bees in an organic garden in Colombia",
                        "fileDetails": {
                            "lastModified": 1571347349000,
                            "lastModifiedDate": "2019-10-17T21:22:29.000Z",
                            "name": "4 Bees.jpg",
                            "size": 480957,
                            "type": "image/jpeg"
                        }
                    }
                ],
                "title": "Ingenuity and Creativity",
                "author": "Michelle",
                "tags": []
            }
        },
        "c5613e60-00d5-11ea-addf-fb8afee817da": {
            "type": "story",
            "value": {
                "id": "c5613e60-00d5-11ea-addf-fb8afee817da",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": "CONTEXTUALIZATION",
                        "blockType": "text",
                        "text": "The city of Cartagena - Colombia, has a population close to 1,036,412 inhabitants according to the projection of municipal population by area developed by the DANE, of which 269,442 are young people between 14 and 28 years old, who represent 26.29% of the general population. We emphasize that the majority of these young people are Afro-descendants and most do not know the levels of realization of their rights, living situations of inequality and social injustice.\n\nIn the Social Justice Repair Kit project, we seek to raise awareness of social diversity in the city of Cartagena through the narration of stories of significant and positive lives of young people living in the city, and in this regard, it was very important to contact youth, youth groups or youth organizations that will develop social, cultural or political activism in the city.\n\nIt was not easy for the project to identify youth organizations or groups that develop a cultural, social or political activism in the city. On the one hand, the government institutions in charge of working with young people did not have a database with the updated information of young people at that time, we had to use the snowball technique based on the information we had of some groups or young people contacted, those who referred us to others and thus managed to contact several of them. This situation gave relevance to the actions developed from the project and think of actions that contribute to remedy that problem .. * the lack of information (timely, truthful, reliable) about youth groups in the city .."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "TELLING THE STORIES",
                        "blockType": "text",
                        "text": "The young people who told their stories have situations of social and political inequality in common, and to cope with this they mobilize their own and community resources to promote the guarantee of the rights of the youth in their community. This work, which is not easy, is the product of social fragmentation and polarization manifested by the apathy and indifference of some young people in the face of defending their rights.\n\nTherefore, young people recognize in telling their stories a valuable tool to make known that we are different, recognizing in the other life experiences that allowed them to move forward despite difficulties or problems, being inspiring for other young people.\n\nTo give visibility to the stories from the project, a virtual platform called “cuéntalo.org” was created, enabling timely and reliable data on young people or youth organizations that develop a social activism, making known the type of activity they carry out, population they work with, location among others .."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "LEARNING",
                        "blockType": "text",
                        "text": "In the development of the project we learned the importance of the articulation of the different disciplines in the achievement of a common objective and in this case of a social nature ... professionals in audiovisual production, systems engineering, psychology among others we articulate knowledge in the identification, formulation and elaboration of the stories being the young active protagonists and the central axis articulated of the actions…"
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "Social Justice Repair Kit",
                        "blockType": "text",
                        "text": "Presentation of the SJRK team [https://www.youtube.com/watch?v=1fxQqDWaDW8](https://www.youtube.com/watch?v=1fxQqDWaDW8)"
                    }
                ],
                "title": "SJRK CARTAGENA, our story…",
                "author": "Amaury",
                "tags": []
            }
        },
        "c7f7a390-f125-11e9-9409-319b90678833": {
            "type": "story",
            "value": {
                "id": "c7f7a390-f125-11e9-9409-319b90678833",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "Young people with learning differences in Rwanda are at the margins of society with limited access to education, economic empowerment and livelihood opportunities. The design of programmes such as education trainings, youth economic empowerment and livelihood do not adequately take into consideration the accessibility needs of young people with learning differences in Rwanda. One of the young people who is a 20 year old deaf young woman said that, “Teachers only know basic sign language but cannot explain the concepts in subjects we study in sign language throughout for us to understand”. Another project participant who is a 27 year old female primary six dropout in Musanze district in North of Rwanda said that, “l dropped out in primary school when I was sitting in my PLE in 2007. I did not have a problem with school fees but I was always feeling sick and headache whenever I went back to school because our neighbour bewitched me. I think she bewitched me because i was performing better in class than her children. I passed my exams but the children of our neighbours were not passing exams. I lived with my uncle then but i left home to go and stay with another family”.\n\nOne of the Project participants who is a 20 year old deaf woman living in Kigali city said that, “I want to be helped to acquire Tailoring machines and capital to open up a shop where I can sell my products. Another Project participant who is a 28 year old male participant living in Kabuga said that, “I am in need of support for capital to start buying Poultry, goats and food commodities from villages and sell them in Kigali city and Urban centres”. Another project participant who is a 28 year old participant living in Musanze district,“I want to acquire more skills on how to manage businesses. I want also to get assistance to build a house for my piglets because they are squeezed here”.\n\nThe Social Justice Repair tool kit project interventions in Rwanda focused on working with young people with learning differences to build their capacity to rise their voices for Inclusion in different aspects of life.The project provided an economic empowerment training on how to start and manage a business. Project allocated US$2000 evolving loan to young people with learning differences through UWEZO youth empowerment to start up Saving and loans groups. IDRC also worked with UWEZO youth empowerment on creating and advocating for an enabling environment to facilitate the inclusion of young people with learning differences in different development activities of their communities and country at large. The project donated a Camera and voice recorder to the youth organisation to capture stories and voices of young people with learning differences to advocate for an inclusive environment for all. "
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl": "./uploads/c7f3fa10-f125-11e9-9409-319b90678833.png",
                        "alternativeText": "The picture shows a group of young people both male and female sitting in a circle listening to one of them presenting to the groups on business ideals.",
                        "description": "Young people attending a training on how to start and manage a business in Kigali City, Rwanda. ",
                        "fileDetails": {
                            "lastModified": 1571347969000,
                            "lastModifiedDate": "2019-10-17T21:32:49.000Z",
                            "name": "Rwanda.png",
                            "size": 870359,
                            "type": "image/png"
                        }
                    }
                ],
                "title": "Matching the needs of young people with learning differences with environment in Rwanda",
                "author": "",
                "tags": []
            }
        },
        "d827c890-fb42-11e9-addf-fb8afee817da": {
            "type": "story",
            "value": {
                "id": "d827c890-fb42-11e9-addf-fb8afee817da",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": "",
                        "blockType": "text",
                        "text": "Being involved in the SJRK project has enabled TakingITGlobal to actively explore, pilot and implement accessibility across our programs and operations.\n\nOngoing engagement across the domains of inclusive design, co-design and social justice movements around the world has allowed TIG staff to practise and test the process of inclusive design across new and existing initiatives augmented through our involvement in the project.\n\nThe first and perhaps biggest change across the organization and our work is an overall culture shift which has led to the organization being more comfortable and familiar with the processes involved in inclusion. At first, differences across ability can be challenging to engage with, as there may be an inward fear of offending, of doing or saying the wrong thing. This fear not can prevent us from starting and thus doing anything that could address barriers and advance accommodations for inclusion.\n\nTo ensure our effort in moving towards inclusion was adopted organization wide, we started by examining TIG’s weekly staff meetings and reviewing them from a participation and inclusion perspective. We set up an open process for ongoing feedback and invited our team to participate in the process of iterative improvement, enabling our team to identify and or present topics they would find useful to their work. We also opened a conversation about differences in our learning and the modalities that would be most appropriate for our ongoing professional development. Next we implemented a staff training on the AODA guidelines and created a digital space for onboarding of new staff which integrates accessibility into the welcoming and onboarding process for future staff. TIG’s tech team also benefited from tool specific conversations which enabled us to share tools and practises which result in a more inclusive design and development process.\n\nIn addition to these steps, our team established ongoing support through a recurring “drop in meeting” that allowed staff to discuss their experiences and challenges with accessibility in a more private personal environment. These changes in work culture led to members of the team disclosing their disability status and ongoing discussions about supports we could implement to effectively accommodate these differences. This culture of support also led to new members of the team proactively and publicly discussing their learning differences in staff meetings, addressing stigma and providing useful insights into how we can more effectively work together."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "Tech Processes",
                        "blockType": "text",
                        "text": "TIG has improved its’ Tech development processes to incorporate new tools which allow us to integrate acessibility into our ongoing design and development work. \n\nTools including the ones below are now integrated into our tech processes, leading to designs that are more usable by people across the spectrum of ability :\n\n* [The Colour Contrast Analyzer](https://developer.paciellogroup.com/resources/contrastanalyser/) - to verify that colour pallets in our designs conform to accessibility best practises\n* [Sim Daltonism](https://michelf.ca/projects/sim-daltonism/) - a colour blindness simulator which allows our designers to see through the eyes of someone with differences in their vision. \n* The [Wave extension](https://wave.webaim.org/extension/) which checks webpages for accessibility elements like ALT text, Aria labels and Headings to ensure our sites will be navigable for individuals across the spectrum of accessibility\n* [Hemmingway](http://www.hemingwayapp.com/) - a webpage which reviews text to ensure it is clear and readable.\n* [Infusion extension](https://fluidproject.org/infusion.html) - a visual accessibility widget that enables websites to be modified to suit the needs of people with visual impairments."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "Inclusive Co-design",
                        "blockType": "text",
                        "text": "In order to ensure perspectives from people with disabilities are also at the center of our work, TIG engaged with organizations and individuals in the accessibility and disability field. \n\nThrough [RisingYouth](https://risingyouth.ca/), we created collaborations and partnerships with CNIB Newbrunswick and we asked for and incorporated feedback from [Déphy Sans Limite](https://dephy-mtl.org/?news=programmes-dintegration-communautaire) to simplify the language of the federal government grants we are administering. TIG is also actively pursuing regional and national collaborations with further organizations such as CNIB, L’Arche, and BestBuddies. Each of these collaborative conversations ends up leading to iterative changes to our processes in order to meet the diverse needs of the stakeholders involved.\n\nTo develop the [Sustainable Development Goal Inclusive Design Toolkit](https://research.tigweb.org/cristian/sdgid/), TIG contracted Matthew Shapiro from [6WheelsConsulting](https://www.6wheelsconsulting.com/) to provide input and expertise from a disability perspective. Collaborating closely with people with disabilities to implement co-design is a necessary step to ensure their perspectives are at the heart of products and processes built for and about them.\n\nWorking closely in community to identify barriers and determine how to move forward together is an essential facet of social justice. Co-design, collaboration and the sharing of tools and best practises have all benefited the individuals on our team, our organization, the stakeholders of our work and our processes for building a more just and inclusive world together. "
                    }
                ],
                "title": "Implementing Integrated Accessibility",
                "author": "TakingITGlobal",
                "tags": [
                    "inclusive design",
                    "SJRK"
                ]
            }
        },
        "df80d2c0-f120-11e9-9409-319b90678833": {
            "type": "story",
            "value": {
                "id": "df80d2c0-f120-11e9-9409-319b90678833",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "In January 2018, the Real Campestre School in Fresno (a small town in the coffee region in Colombia) opened its doors to a new project named: “Oportunidades para jóvenes cafeterxs”. The core of the project is a technological tool, a local network that brings a digital environment into the classroom where students and teachers can upload and share videos, images, text and any kind of digital resources."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "Kimera Local Network",
                        "blockType": "image",
                        "mediaUrl": "./uploads/df0d0250-f120-11e9-9409-319b90678833.png",
                        "alternativeText": "A diagram of the Kimera Local Network showing the server, the setup of the local network, and the devices of the users",
                        "description": "Graphic that explains how works the Kimera Local Network",
                        "fileDetails": {
                            "lastModified": 1571344104000,
                            "lastModifiedDate": "2019-10-17T20:28:24.000Z",
                            "name": "1_red_local_kimera.png",
                            "size": 229214,
                            "type": "image/png"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "Why is this important?",
                        "blockType": "text",
                        "text": "In Fresno, like in many other places in Colombia, connectivity is still a challenge. In the cities, 91 out of 100 schools have Wi-Fi or broadband, but in the countryside, only 53 out of 100 can enjoy this privilege ” (Semana, 2020). "
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "Institución Educativa Real Campestre",
                        "blockType": "image",
                        "mediaUrl": "./uploads/df0e13c0-f120-11e9-9409-319b90678833.JPG",
                        "alternativeText": "A blue and white school entrance. Some people appear in the back of the image. The sky looks white. ",
                        "description": "Photo of the school entrance.",
                        "fileDetails": {
                            "lastModified": 1571344171000,
                            "lastModifiedDate": "2019-10-17T20:29:31.000Z",
                            "name": "2_escuela Real Campestre Mireya..JPG",
                            "size": 2178663,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "A network build of stories!",
                        "blockType": "text",
                        "text": "There is not a technological tool that fully works without an appropriation process. “Oportunidades para jóvenes cafeterxs” seek to raise curiosity and the desire to know and learn as well as the willingness to listen and narrate, in order to use the local network as a tool to share those stories and resources that students and teachers find interesting, fun and useful."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "Poster Aula Digital Abierta",
                        "blockType": "image",
                        "mediaUrl": "./uploads/df125980-f120-11e9-9409-319b90678833.jpg",
                        "alternativeText": "A poster with a message: “During the last 2 years, Karisma Foundation has been working in the developing of the Kimera Local Network, an alternative that provides access to resources through cell phones, tablets, and computers. Allowing us to improve our “teaching-learning” processes in all courses. Thanks for believing in the Real Campestre School”",
                        "description": "Photo of a poster with information about the Kimera Local Network.",
                        "fileDetails": {
                            "lastModified": 1571344636000,
                            "lastModifiedDate": "2019-10-17T20:37:16.000Z",
                            "name": "imageedit_1_7150488559.jpg",
                            "size": 208231,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "What you want to do?",
                        "blockType": "text",
                        "text": "We asked students of Real Campestre to videotaped a short video to introduce themselves. Some of them looked shy in front of the cell phone camera, some spoke too fast, but others looked quite confident. In a diverse group like this, you will find a different reactions and ways to participate in the project.\n\nThe short videos exercises continued during the whole project: it could be understood as a collective album or as the “behind the scenes” of the project."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "Presentation Angie Dayana Escobar Ballesteros",
                        "mediaUrl": "./uploads/df12ceb0-f120-11e9-9409-319b90678833.mp4",
                        "alternativeText": null,
                        "description": "A short video presentation of Angie Dayana Escobar, one of the students participating in the project.",
                        "blockType": "video",
                        "fileDetails": {
                            "lastModified": 1571344424000,
                            "lastModifiedDate": "2019-10-17T20:33:44.000Z",
                            "name": "BELLEZA.mp4",
                            "size": 103242093,
                            "type": "video/mp4"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "Everything is happening!",
                        "blockType": "text",
                        "text": "In the second year of the project, students want to share all the things that were happening in the school. With the support of some of their teachers, they develop a new idea: a newscast to share the news that take place into their own educational community.\n\nInterviews and reports have been filmed by the students using their own cell phones cameras, a low cost microphone and technical tools like tripods and screens to handle the light are building by the students with recycling materials."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "A newscast in the local network",
                        "blockType": "text",
                        "text": "Because connectivity is low or nil in the school, students upload every chapter of the newscast in the local network to be shared with other students or even with their parents when they have access to the network. \n\n“Noticiero Real al día” has 22 videos that are also available on YouTube and Facebook. This initiative has raised new challenges and questions to the students. From what stories they want to share in the news and what technique solutions they need to develop to improve the quality of the image until how they should look and speak in front of the camera.\n\nVisit the youtube channel: \n[https://www.youtube.com/channel/UCwZyE0E5fpLKd607MEJTHiA/videos](https://www.youtube.com/channel/UCwZyE0E5fpLKd607MEJTHiA/videos)"
                    }
                ],
                "title": "From short (very short) videos to a newscast",
                "author": "",
                "tags": []
            }
        },
        "ea12d760-f03f-11e9-8299-d34aa606fc6a": {
            "type": "story",
            "value": {
                "id": "ea12d760-f03f-11e9-8299-d34aa606fc6a",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "Durante el mes de mayo se realizaron 8 talleres auspiciados por la Fundación Karisma en el marco del proyecto Oportunidades para jóvenes rurales. Estos talleres se distribuyeron entre 3 sedes de la institución; sede principal, Mirella 3 talleres, Las Marias 2 talleres y Betania con 3 talleres."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "STOP MOTION",
                        "blockType": "text",
                        "text": "[![STOP MOTION](https://img.youtube.com/vi/t5rKFK3KC2Q/0.jpg)](https://www.youtube.com/watch?v=t5rKFK3KC2Q)"
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "Dinámica del Taller",
                        "blockType": "text",
                        "text": "El taller consiste en una misma formula que va tomando forma dependiendo de las destrezas e intereses de cada grupo.\n\nLo primero, es una presentación grupal en la que compartimos nuestro nombre, edad, gustos y sueños a realizar, seguidamente, bajo la inspiración de los proyectos hablamos de la importancia de las comunicaciones y el arte en el mundo en que nos encontramos y cómo el uso de herramientas web nos permiten la puerta a emprender el camino de nuestro futuro desde hoy.\n\n[![STOP MOTION](https://img.youtube.com/vi/iR6D226g7v8/0.jpg)](https://www.youtube.com/watch?v=iR6D226g7v8)\n\nSe les pide que en una hoja escriban la respuesta a las preguntas; ¿quién soy? ¿de dónde vengo? ¿para dónde voy? y ¿cuál es mi propósito?, con el fin de que contesten a través de un vídeo realizado con las herramientas entregadas. Éste producto se sube a la plataforma bajo el nombre de Cápsula del Tiempo, proyecto que pretende reforzar el horizonte que les permitirá a los chicos desarrollarse en todas las esferas de su vida, narrar su identidad y proyectarse hacia el futuro.\n\nSeguidamente les comparto algo sobre mi trabajo en Las Crónicas de Juana, enfocando las fortalezas de los dispositivos móviles que generalmente tenemos a la mano y con lo cuales podemos realizar casi cualquier cosa en términos creativos y audiovisuales.\n\nDentro del análisis de éstos productos surgen temas claves dentro de la pre, post y producción como: el manejo de la cámara y la importancia de la curiosidad como base de una buena fotografía, tipos de plano y ángulos, la entrevista, la expresión corporal y lingüística, el uso de la música, los derechos de imagen y autoría, trabajo de edición, entre otros.\n\nCabe resaltar que no es posible profundizar acerca de estos temas, pues el tiempo de 2 horas por taller se hace corto entre un universo de detalles que componen una obra visual, sin embargo, se les deja una semilla y en quienes germine, encontrarán en las herramientas entregadas la forma más eficiente de aprender.\n\n[![STOP MOTION](https://img.youtube.com/vi/4XnYqeYHwu0/0.jpg)](https://www.youtube.com/watch?v=4XnYqeYHwu0)\n\nComo ejercicio del taller, tomamos el StopMotion como una de las técnicas de realización más sencilla y eficiente, con la que hacemos una animación grupal, esto les permite a los chicos ver la facilidad con la que podemos llevar a cabo nuestras ideas creativas y llevarse a sus casas la experiencia vivida del mundo que se mueve detrás de los contenidos que todo el tiempo están recibiendo a través de redes sociales y entender que ellos tienen todo para ser también generadores de contenido.\n\n[![STOP MOTION](https://img.youtube.com/vi/HrlQTm2HFZw/0.jpg)](https://www.youtube.com/watch?v=HrlQTm2HFZw)\n \nPara cerrar el taller, se les comparten las herramientas de realización con celular FilmoraGo, MyMovie, Creador de Memes, Creador de Gift y DuRecorder, con las que tienen infinitas posibilidades que ponen a volar su imaginación."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "Sede principal. Mirella.",
                        "blockType": "text",
                        "text": "El jueves 16 de mayo se visitó la sede principal donde fui amablemente recibida a las 8:00 am por la profesora Giovanna. El primer taller se desarrollo dentro de lo esperado con 9º, nos basamos en mi experiencia como comunicadora social y periodista, pensando también en potenciar las habilidades creativas a reforzar con el fin de implementarlas dentro del marco del Noticiero Real al Día. El taller finalizó alrededor de las 10:00 am. El segundo taller tuvo cabida de 10:15 a 12:30 con el grado 8º y el taller de cierre se realizó con 10º y 11º entre la 1 y las 3:30.\n\n[![STOP MOTION](https://img.youtube.com/vi/h3OGP-w6o9g/0.jpg)](https://www.youtube.com/watch?v=h3OGP-w6o9g)\n\nSe identificaron talentos y fortalezas entre algunos chicos y chicas destacados, quienes dentro de sus intereses consideran el camino de las comunicaciones (en su mayoría youtubers) como una posibilidad y necesidad latente para sus futuros cercanos."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "Taller Crearte Comunicativo I",
                        "blockType": "text",
                        "text": "[![Taller Crearte Comunicativo I](https://img.youtube.com/vi/nl56d4Re66o/0.jpg)](https://www.youtube.com/watch?v=nl56d4Re66o)\n\nEvidencia: Informe audiovisual de la experiencia. Ejemplo de reportaje como recomendación al proyecto de noticiero Real al Día."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "Sede Las Marías.",
                        "blockType": "text",
                        "text": "Después de un par de horas de viaje en jeep por un camino destapado y lluvioso, llegamos alrededor de las 8:00 am a la escuela de Las Marías, donde nos esperaba el profesor Byron, quien nos condujo a la clase con los chicos de 9º, quienes se levantaron amablemente ante mi llegada como señal de saludo y respeto. El taller se desarrollo normalmente hasta las 10:00 am, hora en que llegaron los chicos de 8º y con quienes dimos continuidad hasta las 12:00 m.\n\n[![STOP MOTION](https://img.youtube.com/vi/-tgHtkV7vdI/0.jpg)](https://www.youtube.com/watch?v=-tgHtkV7vdI)\n\nPodría decir que la experiencia con estos chicos ha sido una de las más inspiradoras, pues su curiosidad y disposición permitió un trabajo fluido que con un par de horas extra de reunión en la tarde que nos permitió realizar un cortometraje llamdo \"Pecas\" realizado como una colaboración de todos."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "Taller CreArte Comunicativo II. Las Marias",
                        "blockType": "text",
                        "text": "[![Taller CreArte Comunicativo II. Las Marias](https://img.youtube.com/vi/4B19EaQKEXA/0.jpg)](https://www.youtube.com/watch?v=4B19EaQKEXA)\n\nEvidencia: Cortometraje \"Pecas\", sobre el bullying."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "Sede Betania.",
                        "blockType": "text",
                        "text": "Un día soleado nos aguardaba en la vereda Betania, los talleres con 8º, 9º y 11º, se desarrollaron eficientemente gracias a la colaboración de los chicos y sobre todo de la profesora Ruth y su hija, quienes amablemente estuvieron activas y atentas desde el recibimiento hasta el final de los talleres.\n\n[![STOP MOTION](https://img.youtube.com/vi/hx01EvbhYew/0.jpg)](https://www.youtube.com/watch?v=hx01EvbhYew)\n\nFue un día de bastante trabajo, junto a los chicos aplicamos lo aprendido y en la tarde realizamos una actividad de recuperación de la memoria histórica del corregimiento que los ha visto crecer. Fue así como alrededor de 25 chicos que se quedaron para darle continuidad al proceso, se movieron haciendo entrevistas, filmando los espacios, fotografiando curiosidades y sobre todo explorando sus habilidades.\n\nEvidencia: Crónica en Betania, denuncia de problemática\n\n[![STOP MOTION](https://img.youtube.com/vi/cKw6KEJLPv4/0.jpg)](https://www.youtube.com/watch?v=cKw6KEJLPv4)"
                    }
                ],
                "title": "CREARTE COMUNICATIVO Taller creatividad aplicada a la comunicación.",
                "author": "",
                "tags": []
            }
        },
        "eba1c640-f863-11ea-9fdd-552aa35bda8b": {
            "type": "story",
            "value": {
                "id": "eba1c640-f863-11ea-9fdd-552aa35bda8b",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "title": "Jorge's Story",
                "author": "Jorge Almeida",
                "tags": [
                    "family",
                    "love",
                    "wheelchair",
                    "cerebral palsy",
                    "Portugal",
                    "Canada",
                    "respite care",
                    "Liberator"
                ],
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "order": 0,
                        "firstInOrder": true,
                        "lastInOrder": false,
                        "blockType": "image",
                        "mediaUrl": "./uploads/eb84a150-f863-11ea-9fdd-552aa35bda8b.jpg",
                        "fileDetails": {
                            "lastModified": 1600286397060,
                            "name": "Jorge 1.jpg",
                            "size": 347558,
                            "type": "image/jpeg"
                        },
                        "description": "",
                        "alternativeText": "A large group of people, including one small child, sit and stand on the grass near some trees. Many are smiling for the camera. They are dressed for warm weather, with many wearing shorts and T-shirts or tank tops."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "order": 1,
                        "firstInOrder": false,
                        "lastInOrder": false,
                        "blockType": "image",
                        "mediaUrl": "./uploads/eb8ba630-f863-11ea-9fdd-552aa35bda8b.jpg",
                        "description": null,
                        "fileDetails": {
                            "lastModified": 1600286432086,
                            "name": "Jorge 2.jpg",
                            "size": 196661,
                            "type": "image/jpeg"
                        },
                        "alternativeText": "A young man sits in a wheelchair on some grass in front of a pond surrounded by trees, with a basketball lying on the ground in front of him. He is smiling, and his right arm appears to be in motion. He has short brown hair and wears burgundy track pants, grey socks and a pink and yellow tie-dyed T-shirt."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "order": 2,
                        "firstInOrder": false,
                        "lastInOrder": false,
                        "blockType": "image",
                        "mediaUrl": "./uploads/eb8c9090-f863-11ea-9fdd-552aa35bda8b.jpg",
                        "description": null,
                        "fileDetails": {
                            "lastModified": 1600286447839,
                            "name": "Jorge 3.jpg",
                            "size": 226620,
                            "type": "image/jpeg"
                        },
                        "alternativeText": "Two young men in wheelchairs sit side by side at the edge of the street between a small bus and a brick building. They are dressed formally, both wearing ties, with one in a blazer, and are posing and smiling for the camera. In the background there is a man standing beside a wheelchair and an SUV, as well as two people standing on the street directly behind them. "
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "order": 3,
                        "firstInOrder": false,
                        "lastInOrder": false,
                        "blockType": "image",
                        "mediaUrl": "./uploads/eb8df020-f863-11ea-9fdd-552aa35bda8b.jpg",
                        "description": null,
                        "fileDetails": {
                            "lastModified": 1600286494773,
                            "name": "Jorge 4.jpg",
                            "size": 248195,
                            "type": "image/jpeg"
                        },
                        "alternativeText": "A blurry photo shows a young man in a power wheelchair who appears to be moving across a stage. He is beside a table full of trophies, with a number of people sitting behind him on the stage including one woman in a wheelchair."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "order": 4,
                        "firstInOrder": false,
                        "lastInOrder": false,
                        "blockType": "image",
                        "mediaUrl": "./uploads/eb8e8c60-f863-11ea-9fdd-552aa35bda8b.jpg",
                        "description": null,
                        "fileDetails": {
                            "lastModified": 1600286475142,
                            "name": "Jorge 5.jpg",
                            "size": 326699,
                            "type": "image/jpeg"
                        },
                        "alternativeText": "A young man sits in a power wheelchair on a stage. A woman stands beside him and appears to be handing him something."
                    },
                    {
                        "id": null,
                        "language": null,
                        "order": 5,
                        "firstInOrder": false,
                        "lastInOrder": false,
                        "blockType": "text",
                        "heading": "The Early Years",
                        "text": "Hello. My name is Jorge Almeida. I am 42 years old. I was born December 6th, 1970 in San Joao da Madeira in Portugal. \n\nI come from a family of four: my father, mother, sister and me. I have 11 aunts and uncles and a grandmother still living in Portugal. My mother went into the hospital to have me. The nurse came in too early. She pushed me too much. I was black when I came out. She didn't have air for me. \n\nIn 1971 my parents came to Canada and I lived with my grandmother in Portugal four years while the paper work was being done for me to come to Canada. It was because of my disability that it required more paper work to come to this country. I came to Canada with my grandmother in 1975 when I was 4 years old. We came by airplane. We got off at the wrong place: we got off in Toronto. My family was waiting for us in Montreal. Now I am happy to live here in Canada. \n\nMy mother and father did not know I had Cerebral Palsy when I was a baby. I could not crawl on the floor and I was sick most of the time. We went to the doctor. He said I was slow. He did not want to say what I had."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "order": 6,
                        "firstInOrder": false,
                        "lastInOrder": false,
                        "blockType": "image",
                        "mediaUrl": "./uploads/eb8f9dd0-f863-11ea-9fdd-552aa35bda8b.jpg",
                        "description": null,
                        "fileDetails": {
                            "lastModified": 1600286518724,
                            "name": "Jorge 6.jpg",
                            "size": 319357,
                            "type": "image/jpeg"
                        },
                        "alternativeText": "A group of 6 people, including 3 men and 3 women, pose in front of a river under some trees. A bridge appears in the background. One man sits in a wheelchair."
                    },
                    {
                        "id": null,
                        "language": null,
                        "order": 7,
                        "firstInOrder": false,
                        "lastInOrder": false,
                        "blockType": "text",
                        "heading": "Family Life",
                        "text": "On Christmas Eve at my house my cousins and my aunt come over. We talk about the last year and after they play bingo we go upstairs to see a movie. At midnight we all stop what we are doing to say \"Merry Christmas!\"\n\nI like living with my family because they help me with many things. I love my family because they talk to me. I am worried because if they die, where would I go? \n\nMy sister is my good friend. She helps me so much with my care.\n\nMy cousin is my good friend because she works at FBA. I can talk with her about my feelings about housing. Sunday is for talking with family and changing air from the city. My family loves going to the park each Sunday in the summer. We go at 8 am. When we get to the park we eat. I watch the men play ball and after my father goes swimming. Father is the cook of the meat. We come back at about 7 pm . When we get back I want to go to bed. We have so much fun each Sunday. "
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "order": 8,
                        "firstInOrder": false,
                        "lastInOrder": false,
                        "blockType": "image",
                        "mediaUrl": "./uploads/eb908830-f863-11ea-9fdd-552aa35bda8b.jpg",
                        "description": null,
                        "fileDetails": {
                            "lastModified": 1600287263648,
                            "name": "Jorge 7.jpg",
                            "size": 324357,
                            "type": "image/jpeg"
                        },
                        "alternativeText": "A group of 4 people pose in front of a large, landscaped garden of grass and flowers. One man and 2 women stand behind a young man sitting in a wheelchair."
                    },
                    {
                        "id": null,
                        "language": null,
                        "order": 10,
                        "firstInOrder": false,
                        "lastInOrder": false,
                        "blockType": "text",
                        "heading": "Cerebral Palsy",
                        "text": "When I was born my mother went into the hospital and that is where she went so wrong. My doctor worked all night and after he went home. The nurse wanted to go to sleep after a long night of working. My mother had no pain at that time. The nurse came in to help us too early. When I came out I was all black because there was no air for me. I had the umbilical cord around my neck. That is why I have C.P. \n\nThe nurse put many people in wheelchairs. That makes me so angry. Why wasn't she stopped before that day? I had a friend who was in bed all his life because of her. \n\nI felt so angry because my mother went to the hospital to have a beautiful healthy baby boy. I keep thinking: \" What if my mother had had me at home?\"\n\nI can not walk or talk at all and I am in a wheelchair. It is not that bad; I am happy most of the time. I do have a good life but I do ask why me sometimes. But, if God wanted me in a wheelchair, I make the most of it.\n\nI want to do so many things but I can not do them. I am angry because my little sister can drive a car but I can not. Maybe if I did not have CP I would have been more like my sister. I felt sad when my sister went to play with her friends. \n\nI could have been a cook if I wanted. I learned to cook by watching my mother. She is a good cook when she wants to be. \n\nI get angry when people walk slowly when I am trying to get around them. I get so angry when people cut me off. I feel like saying \"I could not stop my wheelchair, sorry\". When I am in a mall trying to get upstairs or downstairs people do not get off the elevator. I get so angry because they have good legs for the stairs.\n\nThis is what people need to do for me:\n\nI need help with everything. I need help getting up in the morning. I need help to go to the washroom and putting clothing on. I need people to feed me. I need help changing chairs for work. I need a beautiful woman to wash me! I need help with all my care. \n"
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "order": 9,
                        "firstInOrder": false,
                        "lastInOrder": false,
                        "blockType": "image",
                        "mediaUrl": "./uploads/eb92d220-f863-11ea-9fdd-552aa35bda8b.jpg",
                        "description": null,
                        "fileDetails": {
                            "lastModified": 1600287482251,
                            "name": "Jorge 8.jpg",
                            "size": 207774,
                            "type": "image/jpeg"
                        },
                        "alternativeText": "A group of people, including a child and a man in a wheelchair, pose in the sun on a road overlooking what appears to be some water and buildings. "
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "order": 11,
                        "firstInOrder": false,
                        "lastInOrder": false,
                        "blockType": "image",
                        "mediaUrl": "./uploads/eb934750-f863-11ea-9fdd-552aa35bda8b.jpg",
                        "description": null,
                        "fileDetails": {
                            "lastModified": 1600287790631,
                            "name": "Jorge 9.jpg",
                            "size": 149524,
                            "type": "image/jpeg"
                        },
                        "alternativeText": "An autographed polaroid (autograph illegible) showing a young man in a wheelchair being embraced by a woman in a short white dress and high heels, who stands on one foot, while lifting the other leg toward the camera. "
                    },
                    {
                        "id": null,
                        "language": null,
                        "order": 12,
                        "firstInOrder": false,
                        "lastInOrder": false,
                        "blockType": "text",
                        "text": "I do not speak so I need a talking machine or a word board to talk.\n\nWhen I was five I had my first Bliss board. My speech therapist Ann made my first board. I liked the board that she made for me. Later on, when I needed a new board I would help her. \n\nThis is how we went about making a Bliss board: We needed to know all the words that I needed for my Bliss board. We had to put all the words and Bliss symbols in their places on the board. If I needed a word and there was no Bliss symbol for that word, we had to make it up. If the word was hamburg we would put bread and meat as one Bliss symbol. We had fun with that. After all the words were in their places, we colored the Bliss board. Here are the colors: people were yellow, feelings were blue, questions and time words were white. There we had a Bliss board!\n\nI did good work. I kept getting 80 or 90 in school. Just think how good I would be if I had \nhad a talking machine that worked back then. I did not answer the teacher much because I was slow to answer. My teacher could not wait for my answer; most days I did not answer a question even if I knew the answer.\n\nMy Talking Computer \t\n\nI once had a talking machine that did not work with my wheelchair, and this went on for two years. I had many therapists who tried to help me but they did not help me all the time. The machine I had would stop so frequently that I was going to the Treatment Centre on average three times a week. I didn't do much work at school such as learning to read because of that faulty machine. I called the therapist at the Treatment Centre so frequently that I felt like sleeping there. The therapist said \"Yes\" it was a good idea to stay there. After fifteen months I told my therapist that I wanted a new machine. \n\nTo sum it up: I was angry and frustrated with the faulty machine because of the many times the therapist and I tried to fix it with no luck. I finally got a new machine called a Light Talker which I had for five years and it never broke. As for my progress in reading, I answered the teacher much more often with this new machine.\n\t\nI have a Liberator now. It has worked well for me so far. I can do so much. I can put in a long talk in my Liberator so I can give a talk. I can print my work on my Liberator too. \n",
                        "heading": "Talking"
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "order": 13,
                        "firstInOrder": false,
                        "lastInOrder": false,
                        "blockType": "image",
                        "mediaUrl": "./uploads/eb939570-f863-11ea-9fdd-552aa35bda8b.jpg",
                        "description": null,
                        "fileDetails": {
                            "lastModified": 1600287989362,
                            "name": "Jorge 10.jpg",
                            "size": 219065,
                            "type": "image/jpeg"
                        },
                        "alternativeText": "A close-up view of a communication aid mounted on a wheelchair, showing the input board up top, with large, circular foot controls below, which are labelled with arrows."
                    },
                    {
                        "id": null,
                        "language": null,
                        "order": 14,
                        "firstInOrder": false,
                        "lastInOrder": false,
                        "blockType": "text",
                        "heading": "Homes",
                        "text": "I went to the Rotary Home for respite care when I was 11 years old. I didn't like going there much because my friends were not there. I thought to myself \"why don't I go with friends?\". So I did and it made the weekend fun. I loved going there mostly when they made a weekend for teenagers. We went there Friday after school so we could party all weekend. We had fun.\n\nUnfortunately, I could no longer go to the Rotary Home for respite care when I became an adult. The Rotary Home is only for children.\n\nParkway House\n\n#### Adult house\n\nAfter many years of trying to find a house for respite, I think I found a good place. I can go there 12 weeks a year if I want. \n\n If I like the house I will take the 6 weeks. If I like the people that work and live there I will go back.\n\nI tried the house for a week. I was excited and afraid to see what the people were like there. When I got there I needed to do paper work with them. I needed to say all I need help with, for example, how I get out of my wheelchair. I liked that they learned from me. \n\nI loved it at this house because the people who work there are funny. What I like the best is the house is good for my wheelchair and the people that live there are not too loud.\n\n#### My dream house \n\nI would like a home with five adults. My house would work like this: the residents would run the house; we would have a say with everything in that house. We would have meetings about everything. We would choose the people that work for us. I would do the bookkeeping on my computer in my room.\n\nWe would do many things. The weekend would be for us to have fun. I would sleep in on Saturday and Sunday. We would go swimming Saturday afternoon and I would go dancing. I would come home when I want. After all, I would be the boss. \n\nThe house would have rooms for five adults. It would be on one floor with two washrooms.\nWe would live and work like a family. We would make it work so well. My family could live so much more without thinking about me so much. I could live so well. All we need is money to make my dream house work.\n\nI have been working on housing for adults for 6 years now. You may be asking how I do it. I write many letters to all the MPs. What I want to see in Ottawa is a place where adults in wheelchairs can go for respite care. I know this is needed in Ottawa. I will keep working on trying to change things for us all. I want to let people know we need this as soon as possible. Many people will use this place .\n"
                    },
                    {
                        "id": null,
                        "language": null,
                        "order": 15,
                        "firstInOrder": false,
                        "lastInOrder": false,
                        "blockType": "text",
                        "text": "Chantal was my girlfriend. We met at the Treatment Centre when I was 4 years old. We went on trips together to Disney World and Toronto.\n\nChantal and I often went together for respite care at the Rotary Home. We were able to talk together without our families. We both used our voice synthesizers. \n\nOn my 21st birthday, Chantal and I went to the Olive Garden with other friends. We told many funny stories and laughed a lot. When the bus driver picked us up to go home he took Chantal to her family's apartment instead of the Rotary Home. We frantically tried to get across to the bus driver that she was going to the Rotary Home. We laughed all the way back.\n\nUnfortunately, Chantal and I could no longer go to the Rotary Home for respite care when we became adults. The Rotary Home is only for children.\n\nChantal and I also went to work at Computer Wise when we finished McArthur High School.\n \nChantal went for respite at Elizabeth Bruyere on October 31, 1995. She became very sick and she was admitted to the General Hospital. On November 4th she was put on a respirator. Later on, she went into a coma for 6 days and caught pneumonia. \n\nI thought I was not allowed to see her there in ICU. I thought I would try anyway. I was very surprised when they let me in ICU. I talked to her for an hour and I kept going to see her every Wednesday morning. I would tell her about the news at work. I talked about many things. I felt that she could hear me.\n \nI went to see her on a Tuesday. Little did I know that it would be my last time to see her. I was afraid that she might die. Thursday I got to work and got the news that she had died the day before, December 13, 1995. I felt very sad but I was thankful that I had seen her the day before. I had to go to a meeting at Algonquin College Thursday afternoon. I could not think very well because I was so sad.\n \nFriday afternoon I went to her wake. I said my last goodbye to her. I went to her funeral on Saturday. I knew her for most of my life. I miss her.\n",
                        "heading": "Chantal Bedard"
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "order": 16,
                        "firstInOrder": false,
                        "lastInOrder": false,
                        "blockType": "image",
                        "mediaUrl": "./uploads/eb94f500-f863-11ea-9fdd-552aa35bda8b.jpg",
                        "description": null,
                        "fileDetails": {
                            "lastModified": 1600288236860,
                            "name": "Jorge 11.jpg",
                            "size": 193738,
                            "type": "image/jpeg"
                        },
                        "alternativeText": "A close-up view of a young woman with dark hair and brown eyes sitting in a chair and smiling with her head tipped back."
                    },
                    {
                        "id": null,
                        "language": null,
                        "order": 17,
                        "firstInOrder": false,
                        "lastInOrder": false,
                        "blockType": "text",
                        "heading": "Camp Life",
                        "text": "When I was 5 years old I went to Merrywood Camp for my first time. I didn't like it there much. My mother made me go for many years. \n\nWhen I was 15 years old all that changed. I went with friends and we made camp exciting. We went swimming, boating, fishing and we went on walks. We went outside when we should have been in bed in the afternoon. They tried to find us but we were too quick for them. We did many bad things back then. We put water on a boy we did not like and we put his clothing up a flag pole. One day I was talking with a friend when a staff person came and got me. I went with her but the minute she was not looking I turned my wheelchair around and I went back to where my friends were. My last year I felt sad because I had fun there. \n\nI have been going to the City of Ottawa recreational programs for 20 years. I like it there because they get new staff. The staff have become my good friends. I like it when they say jokes to me. What I like most of all is my talks with them. We talk about what we are doing in life. We do many activities like swimming, going to plays, boating, going to dinner, and much more. \n\nIn July I went to day camp on Thursdays and Fridays. We saw an interesting movie. We went to the Art Gallery: we went to a workshop in the morning and in the afternoon we had questions to answer. How fun that was!\n\nFor the last 6 years I have been going to the March of Dimes camp in the summer. We travel in the bus for 6 hours and we eat in the bus too. I made many new friends. At the camp, we do many things or sit there in the sun if we want. \n\nIn '97 I had fun on my holiday. We had beautiful weather. We got to the camp at 4 pm. I went to see my room and got changed. I met my help for the week and after we went to eat. The meals there are so good. Monday I went on a bus trip around the city and in the afternoon I went for a walk. I went to the farm on Tuesday. I saw many animals and birds. On Tuesday night I went to the casino but I did not win big money.\n\nI was so excited that I could go last year. After all, I hadn't had a holiday like that for two years. It was so much fun. I had many good friends there. I needed a quick holiday right about then. I needed a holiday so bad. \n"
                    },
                    {
                        "id": null,
                        "language": null,
                        "order": 18,
                        "firstInOrder": false,
                        "lastInOrder": false,
                        "blockType": "text",
                        "text": "I went to the doctor one day. My doctor told me he wanted to put a metal rod in my back and I consented. I thought he knew more than I did about this but I was so wrong. I had the operation and I was supposed to be out of the hospital in nine days but I was in the hospital for 6 weeks. If you eat hospital food for 6 long weeks you too would need to see a doctor! \n\nMy right hand moved around without my control and it would remove the tubes on my body. The doctor gave me too much medication to calm me down and I passed out for a while and there were concerns about my well-being. In addition, I battled with pneumonia which probably came about from the lengthy operation and being in the nude. Then I got a large infection where they sewed me up. \n\nFifteen months later when I went to my uncle's place to have supper I felt a sharp pain. I did not think it was the metal rod. I thought the pain would go away quickly. Later I went to the doctor to have an X-Ray and to my surprise I saw that the rod was broken. I went back to the hospital and the doctors fixed it. This time it was much easier on me. \n\nIf it were today I wouldn't have the rod put in. I did not have pain in my back. The doctor said I would have pain later in life. I did not talk to more doctors. That is where I went wrong. I should have talked with more doctors. \n\n\n#### Life in hospital\n\nWhen I was in the Children's Hospital the nurses did not understand me. They did not want to see what I wanted. One day when I was wet, I kept trying to call for help but they did not come. I sat there all wet for many hours. When my worker came to see me she went for help to get me changed. That was not right; they did not stop to see what I needed. I wish they would make a little talking machine for the hospital. \n",
                        "heading": "My Back Operation"
                    },
                    {
                        "id": null,
                        "language": null,
                        "order": 19,
                        "firstInOrder": false,
                        "lastInOrder": false,
                        "blockType": "text",
                        "text": "I have an electric wheelchair which I work with my left foot. I have a five-way switch that I use with my left foot to work my wheelchair and my Liberator. \n\nI have a Liberator on my wheelchair so I can tell people where to go. A Liberator is a talking computer. My Liberator is plugged into the back of my electric wheelchair. The Liberator has four levels of words which I can go get with a red light on my Liberator. Ex: Let's say I want the word \"people\". I would go to level one and go get the word \"people\" on my Liberator. I can spell on my Liberator too. \n\nI can write on an IBM computer and that is where I wrote my best seller. My Liberator is plugged into a T-Tam ( Trace Transparent Access Module) which is plugged into an IBM computer. I can do all my writing like that. I can work on the Internet as well.\n\nThat is how I use my Liberator.\n",
                        "heading": "My Wheelchair and Liberator"
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "order": 20,
                        "firstInOrder": false,
                        "lastInOrder": false,
                        "blockType": "image",
                        "mediaUrl": "./uploads/eb956a30-f863-11ea-9fdd-552aa35bda8b.jpg",
                        "description": null,
                        "fileDetails": {
                            "lastModified": 1600288585298,
                            "name": "Jorge 12.jpg",
                            "size": 140976,
                            "type": "image/jpeg"
                        },
                        "alternativeText": "Close-up view of someone's foot controlling the large buttons of a communication aid, which are mounted on a foot rest, two of which are visible and are labelled with an up arrow and a right arrow respectively."
                    },
                    {
                        "id": null,
                        "language": null,
                        "order": 21,
                        "firstInOrder": false,
                        "lastInOrder": false,
                        "blockType": "text",
                        "heading": "The Treatment Centre",
                        "text": "When I was 4, I started school. My school was at the Treatment Centre beside the Children's Hospital of Eastern Ontario. \n\nI was lucky because I had a good therapist. Her name was Ann Warrick. We tried a talking machine that was a circle with bliss. We made my first bliss board. I would use my thumb to point to words. Thanks to her I can communicate today. \n\nI had two friends and their names were Liz and Chantal. We had lots of fun together. I still keep in contact with Liz today but sadly, Chantal has left this earth. \n \nOur class went on two trips: one was to Disney World for a week and the other was to Toronto for four days. On the first trip, we flew to Disney World and we met with many teenagers in wheelchairs in a park and we ate and played games with them. \n\nOn the second trip, our class went by bus to Toronto and we went to the zoo where we saw many animals.\n\nI was fourteen years old when I went to Centennial School. Bob Watt was my teacher. He worked with me on an Apple 2E. We worked mostly on Logo. I made many things like houses. \n\nI made my name in Logo. I played with my name for months and months to get it right. The day we saw my name on a computer we cried because we were so pleased with my work. \n\nI went to McArthur High School. I had many good friends there. I liked most of my teachers there but there was one teacher I could not stand. She wanted us to be there on time; I was on time most days. One day, I was talking to a teacher's aide about my back when my angry teacher came to get me. I was so angry at her.\n\nI had a bad year that year because my friend Curtis Biggs died a week before Christmas. We were like brothers, he and I. We went to many places with his dad. We went on a fire truck around Ottawa. We kept going on red lights. We went to many 67 games. We had fun when we went to Beavers together.\n"
                    },
                    {
                        "id": null,
                        "language": null,
                        "order": 22,
                        "firstInOrder": false,
                        "lastInOrder": false,
                        "blockType": "text",
                        "text": "My graduation was June 28, 1993. At 5, Kelly and I went from the Rotell to school. We had our graduation at 6. My girlfriend went too. After the graduation, they had drinks for the people that came to see us. We were there for 5 minutes. After all, we had a graduation party to get to. We had a bus to take us to our party. When we got there we ate and after we danced all night long. The meal was good. What I liked most was that my girlfriend Chantal was with me. We danced all night long. We had so much fun that night",
                        "heading": "My Graduation Night"
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "order": 23,
                        "firstInOrder": false,
                        "lastInOrder": false,
                        "blockType": "image",
                        "mediaUrl": "./uploads/eb95b850-f863-11ea-9fdd-552aa35bda8b.jpg",
                        "description": null,
                        "fileDetails": {
                            "lastModified": 1600288796827,
                            "name": "Jorge 13.jpg",
                            "size": 326699,
                            "type": "image/jpeg"
                        },
                        "alternativeText": "A young man sits in a power wheelchair on a stage. A woman stands beside him and appears to be handing him something."
                    },
                    {
                        "id": null,
                        "language": null,
                        "order": 24,
                        "firstInOrder": false,
                        "lastInOrder": false,
                        "blockType": "text",
                        "heading": "SIP",
                        "text": "One summer I went to the Summer Independence Program in July to learn how to live life independently. The program was at the Rehabilitation Center. I wanted to go to SIP so my doctor said I could go. On June 28 I went to Rotell. We went to see my bedroom and then my mother and I went to the hospital. We had a meeting with my worker and after I said \"See you later\". I went to another meeting to hear about the three weeks.\n\nWe had many meetings about life. We learned many things: cooking with a helper, talking on the telephone and banking. One day the doctor came to talk to us about the birds and the bees. \n"
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "order": 25,
                        "firstInOrder": false,
                        "lastInOrder": false,
                        "blockType": "image",
                        "mediaUrl": "./uploads/eb967ba0-f863-11ea-9fdd-552aa35bda8b.jpg",
                        "description": null,
                        "fileDetails": {
                            "lastModified": 1600288912795,
                            "name": "Jorge 14.jpg",
                            "size": 227116,
                            "type": "image/jpeg"
                        },
                        "alternativeText": "A large group of people pose on an outdoor basketball court, under a basket. Many of them are in wheelchairs in the front row, while others stand behind."
                    },
                    {
                        "id": null,
                        "language": null,
                        "order": 26,
                        "firstInOrder": false,
                        "lastInOrder": false,
                        "blockType": "text",
                        "text": "I am working four days a week at Computer Wise and I love it. I am working on many jobs. I love that. When I go to work I do not know what jobs I will get. I am learning Word Perfect 7. I write e-mail to send to people and they write back to me. I have a pen pal on the net. I like having a friend that I can write to when I want. \n\nThe job I like the most is writing to many MPs to change things. I wrote so many letters for change with no luck. I will keep after them. When we get what we need I will move on. I hope that day comes soon.\n\nI was excited when I tried the Internet. We had been trying to get me on the net for three months. \n\nI want to learn how to do many more jobs. I want to see what work I can do. The first thing I want to try is bookkeeping. I also want to learn how to write a good CV. I could also work with teenagers who need to learn to use their talking machine. I could ask them questions and they would answer me by using their voice box.\n\nLast but not least, I need to show many people how to drive their wheelchairs. If I did this job I would be working five days a week. I could not come to work at Computer Wise again. Yes - there are that many people who need a driving teacher like me. \n\nWe should get money to pay a person that works for me. Then I could find more work for me to do. I could change where I work or that person could go on outings with me if I wanted.\n",
                        "heading": "Jobs"
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "order": 27,
                        "firstInOrder": false,
                        "lastInOrder": false,
                        "blockType": "image",
                        "mediaUrl": "./uploads/eb96c9c0-f863-11ea-9fdd-552aa35bda8b.jpg",
                        "description": null,
                        "fileDetails": {
                            "lastModified": 1600289011515,
                            "name": "Jorge 15.jpg",
                            "size": 208699,
                            "type": "image/jpeg"
                        },
                        "alternativeText": "A young man in a wheelchair sits smiling in front of a woman who stands, holding and reading some papers. They appear to be in an office."
                    },
                    {
                        "id": null,
                        "language": null,
                        "order": 28,
                        "firstInOrder": false,
                        "lastInOrder": false,
                        "blockType": "text",
                        "heading": "Para",
                        "text": "We are so lucky to have a bus for people in wheelchairs. We can go everywhere in the city. I must call for a bus the day before. \n\nWhen a person wants to get somewhere on time, most times he or she can but not all the time. Para is good most of the time but they can be late. One day the bus forgot me at work right before my long holiday. I was so angry because I had places to be that day. I was so late. \n\nI wish I could drive. Then I could go where I want when I want. \n"
                    },
                    {
                        "id": null,
                        "language": null,
                        "order": 29,
                        "firstInOrder": false,
                        "lastInOrder": true,
                        "blockType": "text",
                        "heading": "My Dream",
                        "text": "I dreamt about walking out of my bed one morning. I went to make coffee for my mother and father. They were so surprised that we telephoned my grandma. \n\nI got into my wheelchair to go to work. After ten minutes, I stood up. Everyone at work stared at me with their mouths open. I said, \"Surprise!\". I was so happy. \n"
                    }
                ]
            }
        },
        "f378a100-f11f-11e9-9409-319b90678833": {
            "type": "story",
            "value": {
                "id": "f378a100-f11f-11e9-9409-319b90678833",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "Matthew and Liam met in summer 2019 at the Global Pathfinders Summit in Virginia. This program was run by the Presidential Precinct to honor the 400th year anniversary of the Virginia General Assembly."
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl": "./uploads/f3767e20-f11f-11e9-9409-319b90678833.jpg",
                        "alternativeText": null,
                        "description": null,
                        "fileDetails": {
                            "lastModified": 1571345256000,
                            "lastModifiedDate": "2019-10-17T20:47:36.000Z",
                            "name": "IMAG2545.jpg",
                            "size": 148443,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "200 people from 50 countries and 25 virginians were brought together to learn and share about democracy, history and the global challenges faced by young people in our world today.\n\nDuring a collaborative dotmocracy activity to develop the Virginia Declarations, Matthew and Liam started to engage based on their shared interests and passions around disability and inclusion. \n\nEquitable democractic practices involves including everyone across the spectrum of perspective and ability, weaving together our diversity into a universal approach that yield better results for everyone.\n\nIncreasing the level of democracy in our society is an inclusive design challenge, as our current political systems are exclusionary and don't necessarily have the resources to bring about the level of inclusion that we need to make our world more fair and equitable. \n\nMoving from where we are to where we want to be on these issues requires effort from all stakeholders, unifying our voices and needs to ensure our social systems represent and respond to our evolving needs.\n\n400 years ago modern representative democracy was founded in Virginia, however to truly modernize our social fabric we need to explore new ways of collecting and meeting the needs of our societies across all our beautiful diversity. \n\nWorking together to solve our problems and designing as a collective process is itself the realization of democratic practice.\n\nHow do we define inclusion and who is not currently being included? These questions represent ongoing and evolving conversations which reflect our understanding of power structures that underpin our lives. To truly advance inclusion and build more equitable societies we need to establish and advance more diverse movements that represent and reflect all differences as a strength.\n\nSocial movements need to be made more available to those populations on the margins, including disability. Social movements are generally not accessible and need to conduct self reflection in order to determine why that is the case and how they can address this. \n\n[https://youtu.be/324XEmqe20g](https://youtu.be/324XEmqe20g)"
                    }
                ],
                "title": "GPS Panorama",
                "author": "Liam",
                "tags": [
                    "GPS"
                ]
            }
        }
    }
});
