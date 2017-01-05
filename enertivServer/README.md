# custom enertiv server &#x1F4A1;

A custom-made enertiv server to get the required data from enertiv into a phonegap app.

## List of API

#### /login?loginId=

Need to go into this at the start of any session
requires a loginId, please mail mmg542@nyu.edu if you would like access to these APIs


#### /schema_itp

##### Inputs

None

##### Output

Returns object that contains rooms in ITP and their equipment. Eg -

    id: "756fbd3e-066f-405e-b133-508fc5f18e85",
    parent_sublocation: "cb4d8d3f-c476-4216-9292-43d45610c027",
    name: "Room 448",
    equipments: [
    "e0d808ad-7240-4da3-b8da-779c108d8378"
    ]



#### /floordata_itp

This API call was broken down into the following cases so as to keep the number of points returned under 3000
* if <= 2 days - run in minutes only
* if > 2 days and <= 7 days - run in 15 min + min
* if > 7 days and <= 30 days - run in hours +  min
* if > 30 days and <= 1 yr - run in days and then hours and minutes

##### Inputs

**startTime** - this need to be in the following format - 2016-04-20T21:41:18 - this is a compulsory ip

**sublocationid** - this can be the id of a specific room - not compulsory ( comma separated if you are sending multiple ids )

**equipmentId** - this can be the id of a specific equipment - not compulsory ( comma separated if you are sending multiple ids )
if equipmentId and subocationId are not present, it will automatically give floor numbers.

##### Output

**Data** - time vs power
**Total Energy** in given time period

##### Examples

http://localhost:5000/floordata_itp?startTime=2016-04-20T21:41:18&equipmentId=db954f1c-7602-45c9-85ae-55d555dced75

    [
      {
        data: {
        units: "kW",
          data: [
            {
            x: "2016-04-20T22:00:00Z",
            Lights: 0.2833
            },
            {
            x: "2016-04-20T23:00:00Z",
            Lights: 0.2834
            },
            {
            x: "2016-04-21T00:00:00Z",
            Lights: 0.2835
            },
          .
          .

          ],
          names: [
              "Lights"
            ]
            },
        totalEnergy: 0.5285610571199999,
        id: "db954f1c-7602-45c9-85ae-55d555dced75"
      }
    ]
http://localhost:5000/floordata_itp?startTime=2016-04-20T21:41:18&sublocationId=ce007293-7a34-4a61-80a1-d92312e6cfa9

http://localhost:5000/floordata_itp?startTime=2016-04-20T21:41:18


The original clientjs code was developed by **John Farell** and can be found here - https://github.com/jefarrell/EnertivAPI
