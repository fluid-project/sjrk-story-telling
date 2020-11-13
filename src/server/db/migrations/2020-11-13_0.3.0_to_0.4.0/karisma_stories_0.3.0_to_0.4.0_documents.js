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
        "0087d6f0-6115-11e8-9250-0b33877004ce": {
            "type": "story",
            "value": {
                "id": "0087d6f0-6115-11e8-9250-0b33877004ce",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "title": "Viaje a Medellín",
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
                        "mediaUrl": "./uploads/00840660-6115-11e8-9250-0b33877004ce.jpg",
                        "alternativeText": null,
                        "description": null,
                        "fileDetails": {
                            "lastModified": 1527360055164,
                            "lastModifiedDate": "2018-05-26T18:40:55.164Z",
                            "name": "claudia foto 5.jpg",
                            "size": 129499,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl": "./uploads/00847b90-6115-11e8-9250-0b33877004ce.jpg",
                        "alternativeText": null,
                        "description": null,
                        "fileDetails": {
                            "lastModified": 1527304111601,
                            "lastModifiedDate": "2018-05-26T03:08:31.601Z",
                            "name": "claudia foto 1.jpg",
                            "size": 106676,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl": "./uploads/008517d0-6115-11e8-9250-0b33877004ce.jpg",
                        "alternativeText": null,
                        "description": null,
                        "fileDetails": {
                            "lastModified": 1527304111611,
                            "lastModifiedDate": "2018-05-26T03:08:31.611Z",
                            "name": "claudia foto 2.jpg",
                            "size": 80795,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl": "./uploads/008565f0-6115-11e8-9250-0b33877004ce.jpg",
                        "alternativeText": null,
                        "description": null,
                        "fileDetails": {
                            "lastModified": 1527304111619,
                            "lastModifiedDate": "2018-05-26T03:08:31.619Z",
                            "name": "claudia foto 3.jpg",
                            "size": 78825,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl": "./uploads/00858d00-6115-11e8-9250-0b33877004ce.jpg",
                        "alternativeText": null,
                        "description": null,
                        "fileDetails": {
                            "lastModified": 1527304111628,
                            "lastModifiedDate": "2018-05-26T03:08:31.628Z",
                            "name": "claudia foto 4.jpg",
                            "size": 91466,
                            "type": "image/jpeg"
                        }
                    }
                ],
                "author": "grupo Real campestre la sagrada familia \"Fresno Tolima\"",
                "tags": [
                    "Medellín",
                    "platohedro"
                ]
            }
        },
        "7c9c5490-608f-11e8-9250-0b33877004ce": {
            "type": "story",
            "value": {
                "id": "7c9c5490-608f-11e8-9250-0b33877004ce",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "title": "Dana y Michell",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl": "./uploads/7c9a58c0-608f-11e8-9250-0b33877004ce.jpg",
                        "alternativeText": null,
                        "description": null,
                        "fileDetails": {
                            "lastModified": 1527302830170,
                            "lastModifiedDate": "2018-05-26T02:47:10.170Z",
                            "name": "dana y michell.jpg",
                            "size": 159762,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "Ellas unas chicas super cheberes las cuales nos enseñaron muchisimas cosas y nos divertimos demasiado gracias."
                    }
                ],
                "author": "Camila Lucas",
                "tags": [
                    "Diseño inclusivo"
                ]
            }
        },
        "8c7a2700-603c-11e8-a437-e32071306bc8": {
            "type": "story",
            "value": {
                "id": "8c7a2700-603c-11e8-a437-e32071306bc8",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "title": "Pajaro",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": "introducíon",
                        "blockType": "text",
                        "text": "una historia bonita"
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": "kinglet",
                        "blockType": "image",
                        "mediaUrl": "./uploads/8c778ef0-603c-11e8-a437-e32071306bc8.jpg",
                        "alternativeText": "pajaro",
                        "description": "pajaro pequeño con amarillo",
                        "fileDetails": {
                            "lastModified": 1524251899736,
                            "lastModifiedDate": "2018-04-20T19:18:19.736Z",
                            "name": "little bird 1.jpg",
                            "size": 364528,
                            "type": "image/jpeg"
                        }
                    }
                ],
                "author": "Dana",
                "tags": [
                    "pajaro",
                    "amarillo",
                    "historia"
                ]
            }
        },
        "ab327d10-6090-11e8-9250-0b33877004ce": {
            "type": "story",
            "value": {
                "id": "ab327d10-6090-11e8-9250-0b33877004ce",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "title": "Dana y Michell",
                "content": [
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl": "./uploads/ab31e0d0-6090-11e8-9250-0b33877004ce.jpg",
                        "alternativeText": null,
                        "description": null,
                        "fileDetails": {
                            "lastModified": 1527303304585,
                            "lastModifiedDate": "2018-05-26T02:55:04.585Z",
                            "name": "juan foto 1.jpg",
                            "size": 80542,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "text",
                        "text": "Una reunión super chévere entretenida y Dana, Michell son super"
                    }
                ],
                "author": "Juan Sebatian",
                "tags": [
                    "Diseño inclusivo"
                ]
            }
        },
        "c62f00b0-6041-11e8-a437-e32071306bc8": {
            "type": "story",
            "value": {
                "id": "c62f00b0-6041-11e8-a437-e32071306bc8",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "title": "Aprendiendo ando en medellin",
                "content": [],
                "author": "Giovanna Marcela Ramirez Romero ",
                "tags": [
                    "Jóvenes karisma"
                ]
            }
        },
        "dca39580-6092-11e8-9250-0b33877004ce": {
            "type": "story",
            "value": {
                "id": "dca39580-6092-11e8-9250-0b33877004ce",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "title": "Viaje a medellín",
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
                        "mediaUrl": "./uploads/dca0af50-6092-11e8-9250-0b33877004ce.jpg",
                        "alternativeText": null,
                        "description": null,
                        "fileDetails": {
                            "lastModified": 1527304111601,
                            "lastModifiedDate": "2018-05-26T03:08:31.601Z",
                            "name": "claudia foto 1.jpg",
                            "size": 106676,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl": "./uploads/dca12480-6092-11e8-9250-0b33877004ce.jpg",
                        "alternativeText": null,
                        "description": null,
                        "fileDetails": {
                            "lastModified": 1527304111611,
                            "lastModifiedDate": "2018-05-26T03:08:31.611Z",
                            "name": "claudia foto 2.jpg",
                            "size": 80795,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl": "./uploads/dca172a0-6092-11e8-9250-0b33877004ce.jpg",
                        "alternativeText": null,
                        "description": null,
                        "fileDetails": {
                            "lastModified": 1527304111619,
                            "lastModifiedDate": "2018-05-26T03:08:31.619Z",
                            "name": "claudia foto 3.jpg",
                            "size": 78825,
                            "type": "image/jpeg"
                        }
                    },
                    {
                        "id": null,
                        "language": null,
                        "heading": null,
                        "blockType": "image",
                        "mediaUrl": "./uploads/dca199b0-6092-11e8-9250-0b33877004ce.jpg",
                        "alternativeText": null,
                        "description": null,
                        "fileDetails": {
                            "lastModified": 1527304111628,
                            "lastModifiedDate": "2018-05-26T03:08:31.628Z",
                            "name": "claudia foto 4.jpg",
                            "size": 91466,
                            "type": "image/jpeg"
                        }
                    }
                ],
                "author": "Claudia Ariza",
                "tags": [
                    "Medellín",
                    "platohedro"
                ]
            }
        }
    }
});
