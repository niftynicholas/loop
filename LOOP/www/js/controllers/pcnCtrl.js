angular.module('app.main.controllers')

.controller('pcnCtrl', function($scope, leafletData, $timeout) {
    $scope.currentLocation = {};
    $scope.firstLoad = true;

    var bicycle_parking = {
        "type": "FeatureCollection",
        "generator": "overpass-turbo",
        "copyright": "The data included in this document is from www.openstreetmap.org. The data is made available under ODbL.",
        "timestamp": "2016-08-26T10:37:02Z",
        "features": [{
            "type": "Feature",
            "id": "node/566160884",
            "properties": {
                "@id": "node/566160884",
                "amenity": "bicycle_parking",
                "capacity": "8"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7772229,
                    1.3603402
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1579254568",
            "properties": {
                "@id": "node/1579254568",
                "amenity": "bicycle_parking",
                "name": "Varsity Park Car Park"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7681366,
                    1.2959877
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1837559485",
            "properties": {
                "@id": "node/1837559485",
                "amenity": "bicycle_parking"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7907136,
                    1.3068255
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2138978349",
            "properties": {
                "@id": "node/2138978349",
                "amenity": "bicycle_parking",
                "capacity": "8"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.9444282,
                    1.3607978
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2168508125",
            "properties": {
                "@id": "node/2168508125",
                "amenity": "bicycle_parking"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7517021,
                    1.3595758
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2599918288",
            "properties": {
                "@id": "node/2599918288",
                "amenity": "bicycle_parking"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.9886387,
                    1.4095685
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2845332236",
            "properties": {
                "@id": "node/2845332236",
                "access": "public",
                "amenity": "bicycle_parking",
                "bicycle_parking": "stands",
                "capacity": "8",
                "covered": "no",
                "name": "Garden by the Bay"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8627371,
                    1.2857171
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2859293633",
            "properties": {
                "@id": "node/2859293633",
                "access": "public",
                "amenity": "bicycle_parking",
                "bicycle_parking": "stands",
                "capacity": "15",
                "covered": "no",
                "name": "Bugis+",
                "operator": "Capital Mall"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8536195,
                    1.2995108
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2859293634",
            "properties": {
                "@id": "node/2859293634",
                "access": "public",
                "amenity": "bicycle_parking",
                "bicycle_parking": "wall_loops",
                "capacity": "20",
                "covered": "no",
                "name": "Bugis MRT station"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8558743,
                    1.301047
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2859293635",
            "properties": {
                "@id": "node/2859293635",
                "access": "customers",
                "amenity": "bicycle_parking",
                "bicycle_parking": "stands",
                "capacity": "6",
                "covered": "yes",
                "name": "Chatsworth International School",
                "operator": "Chatsworth International School"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8380742,
                    1.3030335
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2859293636",
            "properties": {
                "@id": "node/2859293636",
                "access": "public",
                "amenity": "bicycle_parking",
                "bicycle_parking": "stands",
                "capacity": "15",
                "covered": "no",
                "name": "Tanglin Mall"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8236297,
                    1.3051187
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2859298016",
            "properties": {
                "@id": "node/2859298016",
                "access": "public",
                "amenity": "bicycle_parking",
                "bicycle_parking": "wall_loops",
                "capacity": "6",
                "covered": "yes",
                "name": "National Library",
                "operator": "National Library"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8543017,
                    1.2979467
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2859298017",
            "properties": {
                "@id": "node/2859298017",
                "access": "public",
                "amenity": "bicycle_parking",
                "bicycle_parking": "wall_loops",
                "capacity": "10",
                "covered": "yes",
                "name": "National Library",
                "operator": "National Library"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8546103,
                    1.2977525
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2859298018",
            "properties": {
                "@id": "node/2859298018",
                "access": "public",
                "amenity": "bicycle_parking",
                "bicycle_parking": "wall_loops",
                "capacity": "36",
                "covered": "no",
                "name": "National Library",
                "operator": "Mational Library"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8541285,
                    1.2970682
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2859298019",
            "properties": {
                "@id": "node/2859298019",
                "access": "public",
                "amenity": "bicycle_parking",
                "bicycle_parking": "wall_loops",
                "capacity": "15",
                "covered": "no",
                "name": "Bras Basah complex"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8532943,
                    1.2966409
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2863808039",
            "properties": {
                "@id": "node/2863808039",
                "access": "public",
                "amenity": "bicycle_parking",
                "bicycle_parking": "stands",
                "capacity": "12",
                "covered": "no",
                "name": "Bugis Junction",
                "operator": "Capital Mall"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8552719,
                    1.2997563
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2863808040",
            "properties": {
                "@id": "node/2863808040",
                "access": "public",
                "amenity": "bicycle_parking",
                "bicycle_parking": "rack",
                "capacity": "50",
                "covered": "no",
                "name": "Paya Lebar"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8936471,
                    1.3183414
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2909151195",
            "properties": {
                "@id": "node/2909151195",
                "access": "public",
                "amenity": "bicycle_parking",
                "bicycle_parking": "wall_loops",
                "capacity": "34",
                "covered": "no",
                "name": "SMU Li Ka Shing",
                "operator": "SMU"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8500092,
                    1.2965648
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2909152653",
            "properties": {
                "@id": "node/2909152653",
                "access": "public",
                "amenity": "bicycle_parking",
                "bicycle_parking": "stands",
                "capacity": "40",
                "covered": "yes",
                "name": "KKH Hospital",
                "operator": "KKH Hospital"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8473879,
                    1.3111485
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2909152654",
            "properties": {
                "@id": "node/2909152654",
                "access": "public",
                "amenity": "bicycle_parking",
                "bicycle_parking": "stands",
                "capacity": "24",
                "covered": "no",
                "name": "Bugis MRT station"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8556645,
                    1.3011316
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2909152655",
            "properties": {
                "@id": "node/2909152655",
                "access": "public",
                "amenity": "bicycle_parking",
                "bicycle_parking": "stands",
                "capacity": "36",
                "covered": "no",
                "name": "Bugis MRT station"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8563235,
                    1.300684
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2909152656",
            "properties": {
                "@id": "node/2909152656",
                "access": "public",
                "amenity": "bicycle_parking",
                "bicycle_parking": "wall_loops",
                "capacity": "10",
                "covered": "yes",
                "name": "Shaw Tower 11th floor",
                "operator": "Shaw Tower Management"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8568223,
                    1.2967662
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2956782872",
            "properties": {
                "@id": "node/2956782872",
                "amenity": "bicycle_parking"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8628908,
                    1.3515913
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/3022203858",
            "properties": {
                "@id": "node/3022203858",
                "amenity": "bicycle_parking",
                "bicycle_parking": "stands"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8568096,
                    1.2986264
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/3023597754",
            "properties": {
                "@id": "node/3023597754",
                "amenity": "bicycle_parking",
                "bicycle_parking": "stands",
                "capacity": "8",
                "covered": "yes",
                "source": "Survey"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8653782,
                    1.2845905
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/3023597755",
            "properties": {
                "@id": "node/3023597755",
                "amenity": "bicycle_parking",
                "bicycle_parking": "stands",
                "capacity": "8",
                "source": "Survey"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8678024,
                    1.2833249
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/3060405337",
            "properties": {
                "@id": "node/3060405337",
                "amenity": "bicycle_parking"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.854569,
                    1.2891416
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/3090578453",
            "properties": {
                "@id": "node/3090578453",
                "amenity": "bicycle_parking"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8541558,
                    1.3304485
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/3201094346",
            "properties": {
                "@id": "node/3201094346",
                "amenity": "bicycle_parking",
                "bicycle_parking": "stands",
                "capacity": "28",
                "covered": "no"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.860311,
                    1.2861979
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/3213891061",
            "properties": {
                "@id": "node/3213891061",
                "amenity": "bicycle_parking",
                "bicycle_parking": "wall_loops",
                "capacity": "4"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.818485,
                    1.3070928
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/3213895277",
            "properties": {
                "@id": "node/3213895277",
                "access": "permissive",
                "amenity": "bicycle_parking",
                "bicycle_parking": "stands",
                "capacity": "20",
                "covered": "yes"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8398377,
                    1.3002386
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/3245698880",
            "properties": {
                "@id": "node/3245698880",
                "amenity": "bicycle_parking",
                "bicycle_parking": "wall_loops",
                "capacity": "10",
                "covered": "yes"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8552492,
                    1.3119489
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/3273173132",
            "properties": {
                "@id": "node/3273173132",
                "amenity": "bicycle_parking"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8828023,
                    1.316164
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/3337490320",
            "properties": {
                "@id": "node/3337490320",
                "amenity": "bicycle_parking",
                "capacity": "5",
                "covered": "no"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7629438,
                    1.2983571
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/3337562953",
            "properties": {
                "@id": "node/3337562953",
                "amenity": "bicycle_parking",
                "capacity": "6",
                "covered": "no"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7629084,
                    1.2974518
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/3345269192",
            "properties": {
                "@id": "node/3345269192",
                "amenity": "bicycle_parking",
                "bicycle_parking": "wall_loops"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8572747,
                    1.2820676
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/3671878657",
            "properties": {
                "@id": "node/3671878657",
                "amenity": "bicycle_parking",
                "bicycle_parking": "shed",
                "building:level": "0",
                "name": "The Bicycle Room"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7721244,
                    1.3055583
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/4281083892",
            "properties": {
                "@id": "node/4281083892",
                "amenity": "bicycle_parking"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8717739,
                    1.3115904
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/4357427255",
            "properties": {
                "@id": "node/4357427255",
                "amenity": "bicycle_parking",
                "name": "Asia Square Tower Level 3/4"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8511124,
                    1.278525
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/4362566042",
            "properties": {
                "@id": "node/4362566042",
                "amenity": "bicycle_parking",
                "bicycle_parking": "stands"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7845449,
                    1.2943334
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/4364216649",
            "properties": {
                "@id": "node/4364216649",
                "amenity": "bicycle_parking",
                "bicycle_parking": "stands",
                "capacity": "56"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7742803,
                    1.3035446
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/4364985519",
            "properties": {
                "@id": "node/4364985519",
                "amenity": "bicycle_parking",
                "bicycle_parking": "stands"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7738608,
                    1.3057311
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/4364985520",
            "properties": {
                "@id": "node/4364985520",
                "amenity": "bicycle_parking",
                "bicycle_parking": "stands"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7786277,
                    1.3111048
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/4366451234",
            "properties": {
                "@id": "node/4366451234",
                "amenity": "bicycle_parking",
                "bicycle_parking": "wall_loops"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7680106,
                    1.3020947
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/4366451235",
            "properties": {
                "@id": "node/4366451235",
                "amenity": "bicycle_parking",
                "bicycle_parking": "wall_loops"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7676955,
                    1.3019439
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/4366451236",
            "properties": {
                "@id": "node/4366451236",
                "amenity": "bicycle_parking",
                "bicycle_parking": "wall_loops"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.767151,
                    1.3021343
                ]
            }
        }]
    };

    var shelters = {
        "type": "FeatureCollection",
        "generator": "overpass-turbo",
        "copyright": "The data included in this document is from www.openstreetmap.org. The data is made available under ODbL.",
        "timestamp": "2016-08-26T04:58:02Z",
        "features": [{
            "type": "Feature",
            "id": "node/394490324",
            "properties": {
                "@id": "node/394490324",
                "amenity": "shelter",
                "name": "Catchment Hut"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7796683,
                    1.3535145
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/394493703",
            "properties": {
                "@id": "node/394493703",
                "amenity": "shelter",
                "name": "North View Hut"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7744583,
                    1.3598642
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/394503085",
            "properties": {
                "@id": "node/394503085",
                "amenity": "shelter",
                "name": "Simpang Hut"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7773766,
                    1.3533515
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/394508972",
            "properties": {
                "@id": "node/394508972",
                "amenity": "shelter",
                "name": "South View Hut"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.779521,
                    1.3493359
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/394512915",
            "properties": {
                "@id": "node/394512915",
                "amenity": "shelter",
                "name": "Seraya Hut"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.772605,
                    1.3580478
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/395142714",
            "properties": {
                "@id": "node/395142714",
                "amenity": "shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.82525,
                    1.37135
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/585160349",
            "properties": {
                "@id": "node/585160349",
                "amenity": "shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.98659,
                    1.3242736
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/661034236",
            "properties": {
                "@id": "node/661034236",
                "amenity": "shelter",
                "name": "Petaling Hut"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.807942,
                    1.3536623
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/661034241",
            "properties": {
                "@id": "node/661034241",
                "amenity": "shelter",
                "name": "Terap Hut"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8184454,
                    1.3538997
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/688979510",
            "properties": {
                "@id": "node/688979510",
                "amenity": "shelter",
                "name": "Belatok Hut"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.9698001,
                    1.406768
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/840055131",
            "properties": {
                "@id": "node/840055131",
                "amenity": "shelter",
                "name": "Tempines Hut"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8095788,
                    1.36141
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/840055277",
            "properties": {
                "@id": "node/840055277",
                "amenity": "shelter",
                "name": "Medang Hut"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8089253,
                    1.3604146
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/840055298",
            "properties": {
                "@id": "node/840055298",
                "amenity": "shelter",
                "name": "Macaranga Hut"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8078222,
                    1.3581057
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/840159369",
            "properties": {
                "@id": "node/840159369",
                "amenity": "shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7716006,
                    1.356887
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/986552503",
            "properties": {
                "@id": "node/986552503",
                "amenity": "shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.9963944,
                    1.3482882
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1110367136",
            "properties": {
                "@id": "node/1110367136",
                "amenity": "shelter",
                "name": "Kelichap Hut"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.9792068,
                    1.4104515
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1110367565",
            "properties": {
                "@id": "node/1110367565",
                "amenity": "shelter",
                "name": "Berberek Hut"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.9791425,
                    1.4145449
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1285282696",
            "properties": {
                "@id": "node/1285282696",
                "amenity": "shelter",
                "fixme": "Actual location",
                "ref": "1D",
                "shelter_type": "wildlife_hide"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7253036,
                    1.4473305
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1307401704",
            "properties": {
                "@id": "node/1307401704",
                "amenity": "shelter",
                "fixme": "Actual location",
                "ref": "2E",
                "shelter_type": "wildlife_hide"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7195996,
                    1.4458885
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1307401852",
            "properties": {
                "@id": "node/1307401852",
                "amenity": "shelter",
                "fixme": "Actual location",
                "ref": "3A",
                "shelter_type": "wildlife_hide"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7186984,
                    1.4478567
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1307401873",
            "properties": {
                "@id": "node/1307401873",
                "amenity": "shelter",
                "fixme": "Actual location",
                "ref": "2D",
                "shelter_type": "wildlife_hide"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7204579,
                    1.4474384
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1363285245",
            "properties": {
                "@id": "node/1363285245",
                "amenity": "shelter",
                "drinking_water": "no",
                "shelter_type": "picnic_shelter",
                "source": "survey"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.789279,
                    1.2850648
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1531015621",
            "properties": {
                "@id": "node/1531015621",
                "amenity": "shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8850268,
                    1.3522537
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1579319304",
            "properties": {
                "@id": "node/1579319304",
                "amenity": "shelter",
                "name": "Varsity PArk Shelters"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7672428,
                    1.2943895
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1592265401",
            "properties": {
                "@id": "node/1592265401",
                "amenity": "shelter",
                "name": "Carpark B Shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7764148,
                    1.3642755
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1628371723",
            "properties": {
                "@id": "node/1628371723",
                "amenity": "shelter",
                "name": "Chemperai Hut"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8236822,
                    1.3427653
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1628371725",
            "properties": {
                "@id": "node/1628371725",
                "amenity": "shelter",
                "name": "Jelutong Hut"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.806086,
                    1.3516787
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1628371726",
            "properties": {
                "@id": "node/1628371726",
                "amenity": "shelter",
                "name": "Rambai Hut"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8277443,
                    1.3528572
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1628371729",
            "properties": {
                "@id": "node/1628371729",
                "amenity": "shelter",
                "name": "Terentang Hut"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8122099,
                    1.3567842
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1628814963",
            "properties": {
                "@id": "node/1628814963",
                "amenity": "shelter",
                "name": "Teruntum"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.9520084,
                    1.3795153
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1628815361",
            "properties": {
                "@id": "node/1628815361",
                "amenity": "shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.9528181,
                    1.3775965
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1628815455",
            "properties": {
                "@id": "node/1628815455",
                "amenity": "shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.9513445,
                    1.3782804
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1628815514",
            "properties": {
                "@id": "node/1628815514",
                "amenity": "shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.9505036,
                    1.3787313
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1628815592",
            "properties": {
                "@id": "node/1628815592",
                "amenity": "shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.9531378,
                    1.3793113
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1628815637",
            "properties": {
                "@id": "node/1628815637",
                "amenity": "shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.9533418,
                    1.3796469
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1628816196",
            "properties": {
                "@id": "node/1628816196",
                "amenity": "shelter",
                "shelter_type": "picnic_shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.9593003,
                    1.3808388
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1628816596",
            "properties": {
                "@id": "node/1628816596",
                "amenity": "shelter",
                "shelter_type": "picnic_shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.960998,
                    1.3811314
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1737074351",
            "properties": {
                "@id": "node/1737074351",
                "amenity": "shelter",
                "name": "Shelter",
                "shelter_type": "weather_shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.9195409,
                    1.339912
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1737077158",
            "properties": {
                "@id": "node/1737077158",
                "amenity": "shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.9203301,
                    1.3393645
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1767392097",
            "properties": {
                "@id": "node/1767392097",
                "amenity": "shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.9754028,
                    1.3169566
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1767392110",
            "properties": {
                "@id": "node/1767392110",
                "amenity": "shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.9895599,
                    1.3319689
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1767392111",
            "properties": {
                "@id": "node/1767392111",
                "amenity": "shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.9933541,
                    1.3409305
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1800181340",
            "properties": {
                "@id": "node/1800181340",
                "amenity": "shelter",
                "name": "Hut"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.9546752,
                    1.4142658
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1918761385",
            "properties": {
                "@id": "node/1918761385",
                "amenity": "shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.9276901,
                    1.3043689
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1919678198",
            "properties": {
                "@id": "node/1919678198",
                "amenity": "shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.9827882,
                    1.3170276
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1948651869",
            "properties": {
                "@id": "node/1948651869",
                "amenity": "shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8060594,
                    1.2645052
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1948651874",
            "properties": {
                "@id": "node/1948651874",
                "amenity": "shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8064288,
                    1.2654404
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1948666509",
            "properties": {
                "@id": "node/1948666509",
                "amenity": "shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8030251,
                    1.2643222
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1948666524",
            "properties": {
                "@id": "node/1948666524",
                "amenity": "shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8047095,
                    1.2628018
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1948666525",
            "properties": {
                "@id": "node/1948666525",
                "amenity": "shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.803699,
                    1.2637195
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1948666528",
            "properties": {
                "@id": "node/1948666528",
                "amenity": "shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8042562,
                    1.2631531
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1985259525",
            "properties": {
                "@id": "node/1985259525",
                "amenity": "shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8707614,
                    1.2861831
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1985259557",
            "properties": {
                "@id": "node/1985259557",
                "amenity": "shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.869511,
                    1.2878904
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1985259558",
            "properties": {
                "@id": "node/1985259558",
                "amenity": "shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.868526,
                    1.2898318
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1985259559",
            "properties": {
                "@id": "node/1985259559",
                "amenity": "shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8690746,
                    1.2902926
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1985259560",
            "properties": {
                "@id": "node/1985259560",
                "amenity": "shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8681977,
                    1.2903667
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1985259562",
            "properties": {
                "@id": "node/1985259562",
                "amenity": "shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8681014,
                    1.2917064
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1985259581",
            "properties": {
                "@id": "node/1985259581",
                "amenity": "shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8685918,
                    1.2923125
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1992265743",
            "properties": {
                "@id": "node/1992265743",
                "amenity": "shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8162967,
                    1.2759095
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1992298090",
            "properties": {
                "@id": "node/1992298090",
                "amenity": "shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8106163,
                    1.2788835
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1992427688",
            "properties": {
                "@id": "node/1992427688",
                "amenity": "shelter",
                "layer": "1"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8046533,
                    1.2802609
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2006122154",
            "properties": {
                "@id": "node/2006122154",
                "amenity": "shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7317905,
                    1.3351473
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2085846137",
            "properties": {
                "@id": "node/2085846137",
                "amenity": "shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8495041,
                    1.3592183
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2085846430",
            "properties": {
                "@id": "node/2085846430",
                "amenity": "shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8457655,
                    1.3610874
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2085846765",
            "properties": {
                "@id": "node/2085846765",
                "amenity": "shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8436332,
                    1.3634506
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2085846887",
            "properties": {
                "@id": "node/2085846887",
                "amenity": "shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.839557,
                    1.3637314
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2085846951",
            "properties": {
                "@id": "node/2085846951",
                "amenity": "shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8409657,
                    1.3641602
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2122184695",
            "properties": {
                "@id": "node/2122184695",
                "amenity": "shelter",
                "name": "Drop-off Point"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7694557,
                    1.3132996
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2138953733",
            "properties": {
                "@id": "node/2138953733",
                "amenity": "shelter",
                "shelter_type": "weather_shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.9498907,
                    1.3634284
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2138953797",
            "properties": {
                "@id": "node/2138953797",
                "amenity": "shelter",
                "shelter_type": "weather_shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.9478107,
                    1.3657297
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2292017120",
            "properties": {
                "@id": "node/2292017120",
                "amenity": "shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8029455,
                    1.2667757
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2292019306",
            "properties": {
                "@id": "node/2292019306",
                "amenity": "shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8016658,
                    1.2668991
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2299144803",
            "properties": {
                "@id": "node/2299144803",
                "amenity": "shelter",
                "fixme": "Actual location",
                "name": "Tower Hide",
                "ref": "2C",
                "shelter_type": "weather_shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7216674,
                    1.4490289
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2299144804",
            "properties": {
                "@id": "node/2299144804",
                "amenity": "shelter",
                "fixme": "Actual location",
                "ref": "S2",
                "shelter_type": "weather_shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7243503,
                    1.4442102
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2299144805",
            "properties": {
                "@id": "node/2299144805",
                "amenity": "shelter",
                "fixme": "Actual location",
                "ref": "1E",
                "shelter_type": "wildlife_hide"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7258665,
                    1.4447862
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2299144806",
            "properties": {
                "@id": "node/2299144806",
                "amenity": "shelter",
                "fixme": "Actual location",
                "ref": "MA2",
                "shelter_type": "weather_shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7217644,
                    1.4449042
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2299144807",
            "properties": {
                "@id": "node/2299144807",
                "amenity": "shelter",
                "fixme": "Actual location",
                "ref": "2B",
                "shelter_type": "wildlife_hide"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7237069,
                    1.4451965
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2299144809",
            "properties": {
                "@id": "node/2299144809",
                "amenity": "shelter",
                "fixme": "Actual location",
                "ref": "MA3",
                "shelter_type": "weather_shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7207516,
                    1.4455072
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2299144810",
            "properties": {
                "@id": "node/2299144810",
                "amenity": "shelter",
                "fixme": "Actual location",
                "ref": "MA1",
                "shelter_type": "weather_shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.723043,
                    1.4456261
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2299144811",
            "properties": {
                "@id": "node/2299144811",
                "amenity": "shelter",
                "fixme": "Actual location",
                "ref": "1A",
                "shelter_type": "wildlife_hide"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7276496,
                    1.4462992
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2299144812",
            "properties": {
                "@id": "node/2299144812",
                "amenity": "shelter",
                "fixme": "Actual location",
                "ref": "S3",
                "shelter_type": "weather_shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7231347,
                    1.4469642
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2299144813",
            "properties": {
                "@id": "node/2299144813",
                "amenity": "shelter",
                "fixme": "Actual location",
                "ref": "2B",
                "shelter_type": "wildlife_hide"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7240784,
                    1.4471382
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2299144814",
            "properties": {
                "@id": "node/2299144814",
                "amenity": "shelter",
                "fixme": "Actual location",
                "ref": "1C",
                "shelter_type": "wildlife_hide"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7266748,
                    1.447576
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2299144816",
            "properties": {
                "@id": "node/2299144816",
                "amenity": "shelter",
                "fixme": "Actual location",
                "ref": "S4",
                "shelter_type": "weather_shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7218481,
                    1.4479288
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2299144817",
            "properties": {
                "@id": "node/2299144817",
                "amenity": "shelter",
                "fixme": "Actual location",
                "ref": "1B",
                "shelter_type": "wildlife_hide"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7278665,
                    1.4495557
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2344613151",
            "properties": {
                "@id": "node/2344613151",
                "amenity": "shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.9195932,
                    1.3402571
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2599846786",
            "properties": {
                "@id": "node/2599846786",
                "amenity": "shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.9442896,
                    1.412551
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2599918290",
            "properties": {
                "@id": "node/2599918290",
                "amenity": "shelter",
                "name": "Punai Hut"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.9885452,
                    1.4096602
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2599975613",
            "properties": {
                "@id": "node/2599975613",
                "amenity": "shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.9898807,
                    1.4108997
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2599975616",
            "properties": {
                "@id": "node/2599975616",
                "amenity": "shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.9925819,
                    1.4082373
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2685023462",
            "properties": {
                "@id": "node/2685023462",
                "amenity": "shelter",
                "name": "Murai Hut"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.9745057,
                    1.4114837
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2686062393",
            "properties": {
                "@id": "node/2686062393",
                "Comment": "PNDOK_KAWAD",
                "Corr_Type": "Uncorrected",
                "Data_Dicti": "Generic",
                "Datafile": "RADHIE-WEBGIS.SSF",
                "Easting": "627638.021",
                "Feat_Name": "Point_ge",
                "Filt_Pos": "11",
                "GNSS_Heigh": "12.364",
                "GPS_Date": "Sun Feb 16 00:00:00 SGT 2014",
                "GPS_Second": "23213.0",
                "GPS_Time": "02:26:37am",
                "GPS_Week": "1780",
                "Horz_Prec": "12.9",
                "Max_HDOP": "0.8",
                "Max_PDOP": "1.4",
                "Northing": "171705.831",
                "Rcvr_Type": "Juno Series 3",
                "Std_Dev": "0.809829",
                "Unfilt_Pos": "11",
                "Vert_Prec": "31.5",
                "amenity": "shelter",
                "name": "Hut"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.6435185,
                    1.5527012
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2720344210",
            "properties": {
                "@id": "node/2720344210",
                "amenity": "shelter",
                "name": "Pekakak Hut",
                "source": "NParks Map of Pulau Ubin, Singapore"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.9835195,
                    1.4098497
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2751197289",
            "properties": {
                "@id": "node/2751197289",
                "amenity": "shelter",
                "name": "Hexagonal shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.9423788,
                    1.3647347
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2824484773",
            "properties": {
                "@id": "node/2824484773",
                "amenity": "shelter",
                "shelter_type": "weather_shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7801404,
                    1.4520098
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2824485059",
            "properties": {
                "@id": "node/2824485059",
                "amenity": "shelter",
                "shelter_type": "weather_shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7808372,
                    1.4530818
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2824486072",
            "properties": {
                "@id": "node/2824486072",
                "amenity": "shelter",
                "shelter_type": "weather_shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.780578,
                    1.4534347
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2824486101",
            "properties": {
                "@id": "node/2824486101",
                "amenity": "shelter",
                "shelter_type": "weather_shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7819105,
                    1.4532853
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2824486102",
            "properties": {
                "@id": "node/2824486102",
                "amenity": "shelter",
                "shelter_type": "weather_shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7824599,
                    1.453992
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2824486282",
            "properties": {
                "@id": "node/2824486282",
                "amenity": "shelter",
                "shelter_type": "weather_shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7780216,
                    1.4519055
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2828368496",
            "properties": {
                "@id": "node/2828368496",
                "amenity": "shelter",
                "shelter_type": "weather_shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7817529,
                    1.4543372
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2834972077",
            "properties": {
                "@id": "node/2834972077",
                "amenity": "shelter",
                "shelter_type": "weather_shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8035321,
                    1.4444475
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2834972648",
            "properties": {
                "@id": "node/2834972648",
                "amenity": "shelter",
                "shelter_type": "weather_shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.804031,
                    1.4455254
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2834973410",
            "properties": {
                "@id": "node/2834973410",
                "amenity": "shelter",
                "shelter_type": "weather_shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8040887,
                    1.4448101
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/3278196663",
            "properties": {
                "@id": "node/3278196663",
                "amenity": "shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.9525164,
                    1.3803177
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/3337475677",
            "properties": {
                "@id": "node/3337475677",
                "amenity": "shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.760819,
                    1.2993851
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/3337490321",
            "properties": {
                "@id": "node/3337490321",
                "amenity": "shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7602475,
                    1.2988072
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/3337490322",
            "properties": {
                "@id": "node/3337490322",
                "amenity": "shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7602094,
                    1.2982126
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/3337490323",
            "properties": {
                "@id": "node/3337490323",
                "amenity": "shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7628152,
                    1.2984605
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/3337562950",
            "properties": {
                "@id": "node/3337562950",
                "amenity": "shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.762164,
                    1.2965028
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/3337562952",
            "properties": {
                "@id": "node/3337562952",
                "amenity": "shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7627431,
                    1.2977754
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/3337571408",
            "properties": {
                "@id": "node/3337571408",
                "amenity": "shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7625024,
                    1.297602
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/3368088193",
            "properties": {
                "@id": "node/3368088193",
                "amenity": "shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8121853,
                    1.2647448
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/3409121857",
            "properties": {
                "@id": "node/3409121857",
                "amenity": "shelter",
                "shelter_type": "Walkway"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.725241,
                    1.3305244
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/3421568783",
            "properties": {
                "@id": "node/3421568783",
                "amenity": "shelter",
                "shelter_type": "weather_shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.6928731,
                    1.3433939
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/3452218614",
            "properties": {
                "@id": "node/3452218614",
                "amenity": "shelter",
                "drinking_water": "no",
                "shelter_type": "picnic_shelter",
                "source": "survey"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.790322,
                    1.2845643
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/3452221520",
            "properties": {
                "@id": "node/3452221520",
                "amenity": "shelter",
                "drinking_water": "no",
                "shelter_type": "picnic_shelter",
                "source": "survey"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7917932,
                    1.2821485
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/3527776021",
            "properties": {
                "@id": "node/3527776021",
                "amenity": "shelter",
                "name": "Drop off point"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8260052,
                    1.2857416
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/3686697570",
            "properties": {
                "@id": "node/3686697570",
                "amenity": "shelter",
                "shelter_type": "weather_shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8211828,
                    1.2705608
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/3892730242",
            "properties": {
                "@id": "node/3892730242",
                "amenity": "shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7755879,
                    1.3405257
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/3958973357",
            "properties": {
                "@id": "node/3958973357",
                "amenity": "shelter",
                "name": "Petai Hut"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8298826,
                    1.3486843
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/4134653899",
            "properties": {
                "@id": "node/4134653899",
                "amenity": "shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7807438,
                    1.368332
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/4222027691",
            "properties": {
                "@id": "node/4222027691",
                "amenity": "shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8151385,
                    1.2942377
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/4226862003",
            "properties": {
                "@id": "node/4226862003",
                "amenity": "shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.9079027,
                    1.3200256
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/4237049191",
            "properties": {
                "@id": "node/4237049191",
                "amenity": "shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.9299587,
                    1.3378253
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/4239522047",
            "properties": {
                "@id": "node/4239522047",
                "amenity": "shelter",
                "bin": "yes",
                "shelter_type": "weather_shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8165748,
                    1.271799
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/4241614214",
            "properties": {
                "@id": "node/4241614214",
                "amenity": "shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7586385,
                    1.3604611
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/4281640468",
            "properties": {
                "@id": "node/4281640468",
                "amenity": "shelter",
                "name": "Merbah Hut",
                "shelter_type": "weather_shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.9584141,
                    1.4061252
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/4285407491",
            "properties": {
                "@id": "node/4285407491",
                "amenity": "shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7775836,
                    1.303819
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/4297625093",
            "properties": {
                "@id": "node/4297625093",
                "amenity": "shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8478848,
                    1.293199
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/4298833722",
            "properties": {
                "@id": "node/4298833722",
                "amenity": "shelter"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8105649,
                    1.278904
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/4298844738",
            "properties": {
                "@id": "node/4298844738",
                "amenity": "shelter",
                "bin": "no"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7928236,
                    1.2813614
                ]
            }
        }]
    };

    var toilets = {
        "type": "FeatureCollection",
        "generator": "overpass-turbo",
        "copyright": "The data included in this document is from www.openstreetmap.org. The data is made available under ODbL.",
        "timestamp": "2016-08-26T07:55:02Z",
        "features": [{
            "type": "Feature",
            "id": "node/319829988",
            "properties": {
                "@id": "node/319829988",
                "amenity": "toilets",
                "created_by": "JOSM"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7300696,
                    1.339996
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/319829990",
            "properties": {
                "@id": "node/319829990",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7318012,
                    1.3382402
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/395060673",
            "properties": {
                "@id": "node/395060673",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7766789,
                    1.3485171
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/471491370",
            "properties": {
                "@id": "node/471491370",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7064545,
                    1.3209222
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/471502414",
            "properties": {
                "@id": "node/471502414",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7891364,
                    1.4037624
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/471502562",
            "properties": {
                "@id": "node/471502562",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7895909,
                    1.400564
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/560660134",
            "properties": {
                "@id": "node/560660134",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8933213,
                    1.2950781
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/560660151",
            "properties": {
                "@id": "node/560660151",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.9229875,
                    1.3035639
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/563630419",
            "properties": {
                "@id": "node/563630419",
                "amenity": "toilets",
                "fee": "no"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.812715,
                    1.3570424
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/602417806",
            "properties": {
                "@id": "node/602417806",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.9191001,
                    1.3416514
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/602417809",
            "properties": {
                "@id": "node/602417809",
                "amenity": "toilets",
                "wheelchair": "yes"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.9340239,
                    1.3389056
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/681253966",
            "properties": {
                "@id": "node/681253966",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8133613,
                    1.2780949
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/686670714",
            "properties": {
                "@id": "node/686670714",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8012494,
                    1.2790388
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/688830361",
            "properties": {
                "@id": "node/688830361",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.9575945,
                    1.4054033
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/688830362",
            "properties": {
                "@id": "node/688830362",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.9753916,
                    1.4182262
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/688862523",
            "properties": {
                "@id": "node/688862523",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.972163,
                    1.4028945
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/688979550",
            "properties": {
                "@id": "node/688979550",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.9892564,
                    1.4084581
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/719058594",
            "properties": {
                "@id": "node/719058594",
                "amenity": "toilets",
                "garmin_type": "0x2f10",
                "name": "M3 Building",
                "source": "Batam Mapping Project"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    104.01645,
                    1.12867
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1110368822",
            "properties": {
                "@id": "node/1110368822",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.9692092,
                    1.4026814
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1244322593",
            "properties": {
                "@id": "node/1244322593",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7784505,
                    1.3081646
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1264546305",
            "properties": {
                "@id": "node/1264546305",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.955738,
                    1.3203712
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1314763924",
            "properties": {
                "@id": "node/1314763924",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.9388456,
                    1.3131003
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1316096706",
            "properties": {
                "@id": "node/1316096706",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8168982,
                    1.2515869
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1316097696",
            "properties": {
                "@id": "node/1316097696",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8176232,
                    1.2510648
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1441335412",
            "properties": {
                "@id": "node/1441335412",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.9542614,
                    1.4074674
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1531015633",
            "properties": {
                "@id": "node/1531015633",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8704517,
                    1.3515994
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1558128582",
            "properties": {
                "@id": "node/1558128582",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7650149,
                    1.3156112
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1579319315",
            "properties": {
                "@id": "node/1579319315",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7678329,
                    1.2934509
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1592267815",
            "properties": {
                "@id": "node/1592267815",
                "amenity": "toilets",
                "designation": "Carpark B Toilet"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.776305,
                    1.3642621
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1651075533",
            "properties": {
                "@id": "node/1651075533",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7874825,
                    1.2972196
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1663976205",
            "properties": {
                "@id": "node/1663976205",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.80305,
                    1.2931378
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1699613290",
            "properties": {
                "@id": "node/1699613290",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8118226,
                    1.37444
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1699613320",
            "properties": {
                "@id": "node/1699613320",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8278407,
                    1.3705036
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1708298809",
            "properties": {
                "@id": "node/1708298809",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.6592592,
                    1.4174196
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1711009658",
            "properties": {
                "@id": "node/1711009658",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7432778,
                    1.4955503
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1721919102",
            "properties": {
                "@id": "node/1721919102",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7762957,
                    1.3333007
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1721919141",
            "properties": {
                "@id": "node/1721919141",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7746438,
                    1.3318202
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1721919145",
            "properties": {
                "@id": "node/1721919145",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7754911,
                    1.3329843
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1721919183",
            "properties": {
                "@id": "node/1721919183",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.773422,
                    1.3313451
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1721919201",
            "properties": {
                "@id": "node/1721919201",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7746864,
                    1.3300782
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1721919220",
            "properties": {
                "@id": "node/1721919220",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7768697,
                    1.3356341
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1721919249",
            "properties": {
                "@id": "node/1721919249",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7769687,
                    1.3340524
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1721919283",
            "properties": {
                "@id": "node/1721919283",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7755876,
                    1.3338638
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1721919291",
            "properties": {
                "@id": "node/1721919291",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7745627,
                    1.3305075
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1721919313",
            "properties": {
                "@id": "node/1721919313",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7752124,
                    1.3317237
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1721919324",
            "properties": {
                "@id": "node/1721919324",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7770253,
                    1.3335688
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1721919329",
            "properties": {
                "@id": "node/1721919329",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7737745,
                    1.3317722
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1721919336",
            "properties": {
                "@id": "node/1721919336",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.771575,
                    1.3327054
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1721919357",
            "properties": {
                "@id": "node/1721919357",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7724816,
                    1.332818
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1721919372",
            "properties": {
                "@id": "node/1721919372",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7745308,
                    1.3337726
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1721919409",
            "properties": {
                "@id": "node/1721919409",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7770051,
                    1.3356224
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1721919414",
            "properties": {
                "@id": "node/1721919414",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7760195,
                    1.3351252
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1722468402",
            "properties": {
                "@id": "node/1722468402",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8350951,
                    1.3424078
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1723843802",
            "properties": {
                "@id": "node/1723843802",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7755875,
                    1.3311797
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1756871630",
            "properties": {
                "@id": "node/1756871630",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.9039516,
                    1.4113491
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1757278074",
            "properties": {
                "@id": "node/1757278074",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.9304387,
                    1.3434918
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1760540621",
            "properties": {
                "@id": "node/1760540621",
                "amenity": "toilets",
                "source": "GPS"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.9109683,
                    1.4209565
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1763813711",
            "properties": {
                "@id": "node/1763813711",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8170793,
                    1.308174
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1763835666",
            "properties": {
                "@id": "node/1763835666",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8145459,
                    1.3207462
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1764794847",
            "properties": {
                "@id": "node/1764794847",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8541137,
                    1.2864988
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1767392094",
            "properties": {
                "@id": "node/1767392094",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.9613515,
                    1.3142766
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1769151114",
            "properties": {
                "@id": "node/1769151114",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8197806,
                    1.2557348
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1776801673",
            "properties": {
                "@id": "node/1776801673",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.84666,
                    1.2218916
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1776801674",
            "properties": {
                "@id": "node/1776801674",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8503621,
                    1.219332
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1777674288",
            "properties": {
                "@id": "node/1777674288",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.85542,
                    1.2890726
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1778934723",
            "properties": {
                "@id": "node/1778934723",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8140841,
                    1.254296
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1829398121",
            "properties": {
                "@id": "node/1829398121",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8651789,
                    1.2841437
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1829398216",
            "properties": {
                "@id": "node/1829398216",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8635153,
                    1.2826998
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1829398225",
            "properties": {
                "@id": "node/1829398225",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.861948,
                    1.2785306
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1829398258",
            "properties": {
                "@id": "node/1829398258",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8654209,
                    1.2826011
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1829398299",
            "properties": {
                "@id": "node/1829398299",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8646264,
                    1.2816929
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1832238038",
            "properties": {
                "@id": "node/1832238038",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8601269,
                    1.2823733
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1832238048",
            "properties": {
                "@id": "node/1832238048",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8580945,
                    1.2825759
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1832238051",
            "properties": {
                "@id": "node/1832238051",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8589406,
                    1.2825759
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1832238067",
            "properties": {
                "@id": "node/1832238067",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8594028,
                    1.2832127
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1832238074",
            "properties": {
                "@id": "node/1832238074",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8587423,
                    1.2833373
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1832238085",
            "properties": {
                "@id": "node/1832238085",
                "amenity": "toilets",
                "wheelchair": "yes"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8608744,
                    1.2835545
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1832238112",
            "properties": {
                "@id": "node/1832238112",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8610666,
                    1.2839876
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1832238142",
            "properties": {
                "@id": "node/1832238142",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8601266,
                    1.2845596
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1832238162",
            "properties": {
                "@id": "node/1832238162",
                "amenity": "toilets",
                "wheelchair": "yes"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8595507,
                    1.2854644
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1833153717",
            "properties": {
                "@id": "node/1833153717",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8469179,
                    1.2949347
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1833748760",
            "properties": {
                "@id": "node/1833748760",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8710738,
                    1.2802016
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1853832322",
            "properties": {
                "@id": "node/1853832322",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.9567998,
                    1.3122965
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1865248400",
            "properties": {
                "@id": "node/1865248400",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8713734,
                    1.2928631
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1867211717",
            "properties": {
                "@id": "node/1867211717",
                "amenity": "toilets",
                "name": "Toilets @ MRT Station"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8435245,
                    1.2841663
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1867211761",
            "properties": {
                "@id": "node/1867211761",
                "amenity": "toilets",
                "name": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7067747,
                    1.3196374
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1867211776",
            "properties": {
                "@id": "node/1867211776",
                "amenity": "toilets",
                "name": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7069464,
                    1.3188759
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1867211785",
            "properties": {
                "@id": "node/1867211785",
                "amenity": "toilets",
                "name": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.70538,
                    1.3176531
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1867211791",
            "properties": {
                "@id": "node/1867211791",
                "amenity": "toilets",
                "name": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.70435,
                    1.3182752
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1867211792",
            "properties": {
                "@id": "node/1867211792",
                "amenity": "toilets",
                "name": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7055731,
                    1.3188437
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1918761381",
            "properties": {
                "@id": "node/1918761381",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.9288917,
                    1.3049481
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1936884592",
            "properties": {
                "@id": "node/1936884592",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8526502,
                    1.2946854
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1948670444",
            "properties": {
                "@id": "node/1948670444",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8055678,
                    1.2640407
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1948670456",
            "properties": {
                "@id": "node/1948670456",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8035213,
                    1.2648129
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1948721877",
            "properties": {
                "@id": "node/1948721877",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.794198,
                    1.4053091
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1948721893",
            "properties": {
                "@id": "node/1948721893",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7944018,
                    1.4059285
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1948917750",
            "properties": {
                "@id": "node/1948917750",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7908207,
                    1.4051128
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1950853897",
            "properties": {
                "@id": "node/1950853897",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.6301122,
                    1.4265207
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1985259730",
            "properties": {
                "@id": "node/1985259730",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8680306,
                    1.2937545
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2003569672",
            "properties": {
                "@id": "node/2003569672",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.6666351,
                    1.6365877
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2003570000",
            "properties": {
                "@id": "node/2003570000",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.6670804,
                    1.6354991
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2006122294",
            "properties": {
                "@id": "node/2006122294",
                "amenity": "toilets",
                "fee": "no"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7304886,
                    1.3368471
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2031222865",
            "properties": {
                "@id": "node/2031222865",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.6283428,
                    1.4258031
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2031223035",
            "properties": {
                "@id": "node/2031223035",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.627384,
                    1.4267897
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2031223130",
            "properties": {
                "@id": "node/2031223130",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.6312459,
                    1.4273095
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2031223749",
            "properties": {
                "@id": "node/2031223749",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.6295422,
                    1.428316
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2120302627",
            "properties": {
                "@id": "node/2120302627",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8672996,
                    1.3057152
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2163975032",
            "properties": {
                "@id": "node/2163975032",
                "amenity": "toilets",
                "source": "Local"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.6480798,
                    1.5567046
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2282381005",
            "properties": {
                "@id": "node/2282381005",
                "amenity": "toilets",
                "fee": "no"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7631076,
                    1.3494469
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2379768090",
            "properties": {
                "@id": "node/2379768090",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.9322862,
                    1.3419113
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2628133568",
            "properties": {
                "@id": "node/2628133568",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7292583,
                    1.3375716
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2689275605",
            "properties": {
                "@id": "node/2689275605",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7669225,
                    1.3030709
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2824444849",
            "properties": {
                "@id": "node/2824444849",
                "access": "public",
                "amenity": "toilets",
                "fee": "no"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7848068,
                    1.4418039
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2824445937",
            "properties": {
                "@id": "node/2824445937",
                "amenity": "toilets",
                "fee": "no"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7788686,
                    1.4524969
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2825676035",
            "properties": {
                "@id": "node/2825676035",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7702658,
                    1.4390339
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2828438603",
            "properties": {
                "@id": "node/2828438603",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8329825,
                    1.4105156
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2854028115",
            "properties": {
                "@id": "node/2854028115",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.835963,
                    1.4371688
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/3088461452",
            "properties": {
                "@id": "node/3088461452",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7818246,
                    1.4438787
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/3088463006",
            "properties": {
                "@id": "node/3088463006",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8410897,
                    1.4262992
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/3088463007",
            "properties": {
                "@id": "node/3088463007",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.843921,
                    1.4241905
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/3088463008",
            "properties": {
                "@id": "node/3088463008",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8418612,
                    1.4232069
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/3100209898",
            "properties": {
                "@id": "node/3100209898",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7420711,
                    1.3400088
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/3149373189",
            "properties": {
                "@id": "node/3149373189",
                "access": "public",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.9056892,
                    1.2985585
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/3151978883",
            "properties": {
                "@id": "node/3151978883",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7683552,
                    1.2987462
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/3161803161",
            "properties": {
                "@id": "node/3161803161",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8177895,
                    1.4008526
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/3220195409",
            "properties": {
                "@id": "node/3220195409",
                "amenity": "toilets",
                "name": "Toilet"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7427355,
                    1.4391565
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/3221378119",
            "properties": {
                "@id": "node/3221378119",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7382736,
                    1.4387777
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/3221593384",
            "properties": {
                "@id": "node/3221593384",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7351642,
                    1.4401883
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/3270116657",
            "properties": {
                "@id": "node/3270116657",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7294191,
                    1.3385904
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/3273154946",
            "properties": {
                "@id": "node/3273154946",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8589397,
                    1.2842103
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/3446723006",
            "properties": {
                "@id": "node/3446723006",
                "amenity": "toilets",
                "source": "survey"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7697508,
                    1.2939849
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/3451431524",
            "properties": {
                "@id": "node/3451431524",
                "amenity": "toilets",
                "source": "survey"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.794272,
                    1.279549
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/3483489163",
            "properties": {
                "@id": "node/3483489163",
                "amenity": "toilets",
                "fee": "no",
                "source": "estimation; extrapolation; survey"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8624529,
                    1.2892726
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/3671878656",
            "properties": {
                "@id": "node/3671878656",
                "amenity": "toilets",
                "building:level": "0"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7720513,
                    1.3055704
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/3684764329",
            "properties": {
                "@id": "node/3684764329",
                "amenity": "toilets",
                "building:level": "2",
                "building:part": "yes"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.9862105,
                    1.3557613
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/3684764395",
            "properties": {
                "@id": "node/3684764395",
                "amenity": "toilets",
                "building:level": "2",
                "building:part": "yes"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.9867416,
                    1.3569668
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/3684764445",
            "properties": {
                "@id": "node/3684764445",
                "amenity": "toilets",
                "building:level": "2",
                "building:part": "yes"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.9862938,
                    1.3575727
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/3744041515",
            "properties": {
                "@id": "node/3744041515",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8007666,
                    1.4936587
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/3744057162",
            "properties": {
                "@id": "node/3744057162",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8458653,
                    1.4763697
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/3839169905",
            "properties": {
                "@id": "node/3839169905",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7974212,
                    1.4034001
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/3839169917",
            "properties": {
                "@id": "node/3839169917",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7967215,
                    1.4034966
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/3839170479",
            "properties": {
                "@id": "node/3839170479",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.792025,
                    1.4015982
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/3839173546",
            "properties": {
                "@id": "node/3839173546",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7928428,
                    1.4038859
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/3979564241",
            "properties": {
                "@id": "node/3979564241",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.841744,
                    1.2917137
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/4104796189",
            "properties": {
                "@id": "node/4104796189",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    104.0946436,
                    1.1877377
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/4104796389",
            "properties": {
                "@id": "node/4104796389",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    104.0936109,
                    1.1884401
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/4132111948",
            "properties": {
                "@id": "node/4132111948",
                "access": "permissive",
                "amenity": "toilets",
                "male": "yes",
                "toilets:disposal": "flush"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7718363,
                    1.2951355
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/4197413863",
            "properties": {
                "@id": "node/4197413863",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.6562352,
                    1.4825741
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/4197414589",
            "properties": {
                "@id": "node/4197414589",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.655916,
                    1.4802601
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/4247879694",
            "properties": {
                "@id": "node/4247879694",
                "amenity": "toilets",
                "operator": "MRT"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8489099,
                    1.2822559
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/4269943999",
            "properties": {
                "@id": "node/4269943999",
                "access": "yes",
                "amenity": "toilets",
                "fee": "no",
                "toilets:disposal": "flush"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.6922751,
                    1.3425869
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/4271006031",
            "properties": {
                "@id": "node/4271006031",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.91428,
                    1.3015857
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/4281193590",
            "properties": {
                "@id": "node/4281193590",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8718942,
                    1.3117935
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/4288310005",
            "properties": {
                "@id": "node/4288310005",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.6931631,
                    1.352347
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/4293900692",
            "properties": {
                "@id": "node/4293900692",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.817045,
                    1.2519563
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/4293900891",
            "properties": {
                "@id": "node/4293900891",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8214617,
                    1.2503509
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/4293904490",
            "properties": {
                "@id": "node/4293904490",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8167388,
                    1.2514169
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/4293905289",
            "properties": {
                "@id": "node/4293905289",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8172681,
                    1.2511433
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/4297812089",
            "properties": {
                "@id": "node/4297812089",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.848727,
                    1.296276
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/4297812190",
            "properties": {
                "@id": "node/4297812190",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8482493,
                    1.2968383
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/4309450590",
            "properties": {
                "@id": "node/4309450590",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8365964,
                    1.4614575
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/4309458068",
            "properties": {
                "@id": "node/4309458068",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.837562,
                    1.4632587
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/4310323189",
            "properties": {
                "@id": "node/4310323189",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8326844,
                    1.3412565
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/4310990890",
            "properties": {
                "@id": "node/4310990890",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8445061,
                    1.2805901
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/4317156704",
            "properties": {
                "@id": "node/4317156704",
                "amenity": "toilets"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7915739,
                    1.548899
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/4337885989",
            "properties": {
                "@id": "node/4337885989",
                "amenity": "toilets",
                "operator": "singapore botanic garden"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8147574,
                    1.311919
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/4337888289",
            "properties": {
                "@id": "node/4337888289",
                "amenity": "toilets",
                "operator": "singapore botanic garden"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8143423,
                    1.3141632
                ]
            }
        }]
    };

    var drinking_water = {
        "type": "FeatureCollection",
        "generator": "overpass-turbo",
        "copyright": "The data included in this document is from www.openstreetmap.org. The data is made available under ODbL.",
        "timestamp": "2016-08-26T09:36:02Z",
        "features": [{
            "type": "Feature",
            "id": "node/1625964733",
            "properties": {
                "@id": "node/1625964733",
                "amenity": "drinking_water"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8164758,
                    1.3165415
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1628817488",
            "properties": {
                "@id": "node/1628817488",
                "amenity": "drinking_water"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.9454762,
                    1.3833952
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1736930799",
            "properties": {
                "@id": "node/1736930799",
                "amenity": "drinking_water",
                "designation": "Water Fountain"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.924348,
                    1.347382
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1736931008",
            "properties": {
                "@id": "node/1736931008",
                "amenity": "drinking_water",
                "designation": "Water Fountain"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.9193554,
                    1.3416211
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1757312860",
            "properties": {
                "@id": "node/1757312860",
                "amenity": "drinking_water",
                "created_by": "iLOE 1.9",
                "source": "survey"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.81613,
                    1.308583
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/1757319050",
            "properties": {
                "@id": "node/1757319050",
                "amenity": "drinking_water",
                "source": "survey"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.816226,
                    1.314945
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2351681316",
            "properties": {
                "@id": "node/2351681316",
                "amenity": "drinking_water",
                "description": "National Library Central Basement level, near the restroom.",
                "source": "wetap.org",
                "wetap:status": "working",
                "wetap:statusnote": "clean and working"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.85367,
                    1.2978
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2854769902",
            "properties": {
                "@id": "node/2854769902",
                "amenity": "drinking_water",
                "source": "Survey",
                "toilets:wheelchair": "yes",
                "wheelchair": "yes"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8162952,
                    1.3148922
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/3451416626",
            "properties": {
                "@id": "node/3451416626",
                "amenity": "drinking_water",
                "source": "survey"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7942572,
                    1.279556
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/3671878660",
            "properties": {
                "@id": "node/3671878660",
                "amenity": "drinking_water",
                "building:level": "0"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7722015,
                    1.3055979
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/3924980567",
            "properties": {
                "@id": "node/3924980567",
                "amenity": "drinking_water",
                "level": "1"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.7698155,
                    1.3028325
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/4281193591",
            "properties": {
                "@id": "node/4281193591",
                "amenity": "drinking_water"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.9864936,
                    1.3584063
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/4293900892",
            "properties": {
                "@id": "node/4293900892",
                "amenity": "drinking_water"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8168527,
                    1.2516221
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/4293905189",
            "properties": {
                "@id": "node/4293905189",
                "amenity": "drinking_water",
                "name": "free drinking water"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8908243,
                    1.3147294
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/4293905290",
            "properties": {
                "@id": "node/4293905290",
                "amenity": "drinking_water"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8232832,
                    1.2579648
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/4293905489",
            "properties": {
                "@id": "node/4293905489",
                "amenity": "drinking_water"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8172924,
                    1.2511083
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/4294907189",
            "properties": {
                "@id": "node/4294907189",
                "amenity": "drinking_water"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.864578,
                    1.2816382
                ]
            }
        }]
    };

    var bicycle_rental = {
        "type": "FeatureCollection",
        "generator": "overpass-turbo",
        "copyright": "The data included in this document is from www.openstreetmap.org. The data is made available under ODbL.",
        "timestamp": "2016-08-26T10:41:02Z",
        "features": [{
            "type": "Feature",
            "id": "node/1853830435",
            "properties": {
                "@id": "node/1853830435",
                "amenity": "bicycle_rental",
                "name": "PCN PitStop",
                "service:bicycle:pump": "yes",
                "service:bicycle:rental": "yes"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    104.0050771,
                    1.3731798
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2138851001",
            "properties": {
                "@id": "node/2138851001",
                "amenity": "bicycle_rental",
                "name": "PCN Pitstop",
                "shop": "kiosk"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.9439166,
                    1.3570245
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/2207169066",
            "properties": {
                "@id": "node/2207169066",
                "amenity": "bicycle_rental"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.9525153,
                    1.3747427
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/3036694889",
            "properties": {
                "@id": "node/3036694889",
                "addr:city": "Singapore",
                "addr:housenumber": "B",
                "addr:postcode": "179682",
                "addr:street": "Connaught Drive",
                "amenity": "bicycle_rental",
                "name": "The Bicycle Hut",
                "phone": "+65 9731 0817",
                "website": "http://kamalishnin.wix.com/the-bicycle-hut & https://www.facebook.com/TheBicycleHut"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.8541083,
                    1.2917993
                ]
            }
        }, {
            "type": "Feature",
            "id": "node/4161032489",
            "properties": {
                "@id": "node/4161032489",
                "amenity": "bicycle_rental"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    103.9156821,
                    1.3019099
                ]
            }
        }]
    };

    angular.extend($scope, {
        center: {
            lat: 1.3521,
            lng: 103.8198,
            zoom: 11
        },
        paths: {
            currentLoc: {
                type: 'circleMarker',
                fillColor: '#4183D7', //DarkSlateGray
                //color: '#000000',
                ///weight: 1,
                opacity: 80,
                fillOpacity: 0.9,
                stroke: false,
                clickable: false,
                latlngs: [0, 0], //1.2997810230344622, 103.90907790873663
                radius: 10
            },
        },
        tiles: {
            url: "https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibmlmdHluaWNob2xhcyIsImEiOiJjaXIxcDhvcWIwMnU1ZmxtOGxjNHpnOGU4In0.pWUMFrYIUOi5ocgcRWbW8Q",
            // url: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
            options: {
                attribution: 'All maps &copy; <a href="http://www.opencyclemap.org">OpenCycleMap</a>, map data &copy; <a href="http://www.openstreetmap.org">OpenStreetMap</a> (<a href="http://www.openstreetmap.org/copyright">ODbL</a>'
            }
        },
        defaults: {
            scrollWheelZoom: true,
            zoomControl: true
        },
        layers: {
            overlays: {
                toilets: {
                    name: 'Toilets',
                    type: 'geoJSONAwesomeMarker',
                    data: toilets,
                    visibile: false,
                    icon: {
                        icon: 'male',
                        markerColor: 'black',
                        prefix: 'fa'
                    }
                },
                shelters: {
                    name: 'Shelters',
                    type: 'geoJSONAwesomeMarker',
                    data: shelters,
                    visibile: false,
                    icon: {
                        icon: 'umbrella',
                        markerColor: 'orange',
                        prefix: 'fa'
                    }
                },
                drinking_water: {
                    name: 'Drinking Water Points',
                    type: 'geoJSONAwesomeMarker',
                    data: drinking_water,
                    visibile: false,
                    icon: {
                        icon: 'tint',
                        markerColor: 'blue',
                        prefix: 'fa'
                    }
                },
                bicycle_parking: {
                    name: 'Bicycle Parking Lots',
                    type: 'geoJSONAwesomeMarker',
                    data: bicycle_parking,
                    visibile: false,
                    icon: {
                        icon: 'bicycle',
                        markerColor: 'gray',
                        prefix: 'fa'
                    }
                },
                bicycle_rental: {
                    name: 'Bicycle Rentals',
                    type: 'geoJSONAwesomeMarker',
                    data: bicycle_rental,
                    visibile: false,
                    icon: {
                        icon: 'key',
                        markerColor: 'green',
                        prefix: 'fa'
                    }
                }
            }
        }
    });


    leafletData.getMap("pcn").then(function(map) {
        setInterval(function() {
            map.invalidateSize();
        }, 3000); //every 3s
        map.locate({
            watch: true,
            enableHighAccuracy: false
        });
        map.on('locationfound', function(e) {
            $scope.currentLocation = {
                lat: e.latlng.lat,
                lng: e.latlng.lng
            };
            if ($scope.firstLoad) {
                map.setView($scope.currentLocation, 16);
                $scope.firstLoad = false;
            }
            $scope.paths.currentLoc.latlngs = [];
            $scope.paths.currentLoc.latlngs.push(e.latlng.lat);
            $scope.paths.currentLoc.latlngs.push(e.latlng.lng);
        });
        map.on('locationerror', function(e) {
            console.log('Location access denied.');
        });
    });

    $scope.locateMe = function() {
        leafletData.getMap("pcn").then(function(map) {
            map.setView($scope.currentLocation);
        });
    }


    //
    // leafletData.getMap("pcn").then(function(map) {
    //     // var track = new L.KML("js/Park_Connector_Loop.kml", {
    //     //     async: true
    //     // });
    //     // track.on("loaded", function(e) {
    //     //     map.fitBounds(e.target.getBounds());
    //     // });
    //     // map.addLayer(track);
    //     // map.addControl(new L.Control.Layers({}, {
    //     //     'Park Connector Network': track
    //     // }));
    //
    //     var customLayer = L.geoJson(null, {
    //         // http://leafletjs.com/reference.html#geojson-style
    //         style: function(feature) {
    //             return {
    //                 color: '#0d5e4e'
    //             };
    //         }
    //     });
    //
    //     omnivore.geojson('js/Park_Connector_Loop.geojson', null, customLayer).addTo(map);
    //
    //     map.addControl(new L.Control.Layers({}, {
    //         'Park Connector Network': customLayer
    //     }));
    // });
})
