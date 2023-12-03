const handleAPICall = (req, res) => {
  const { modelId, modelVersionId, imageUrl } = req.body;
  // Your PAT (Personal Access Token) can be found in the portal under Authentification
  const PAT = "7a642105b2214d968da39d8e956b3914";

  // Specify the correct user_id/app_id pairings
  // Since you're making inferences outside your app's scope
  const USER_ID = "clarifai";
  const APP_ID = "main";

  const raw = JSON.stringify({
    user_app_id: {
      user_id: USER_ID,
      app_id: APP_ID,
    },
    inputs: [
      {
        data: {
          image: {
            url: imageUrl,
          },
        },
      },
    ],
  });

  const requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: "Key " + PAT,
    },
    body: raw,
  };

  return fetch(
    "https://api.clarifai.com/v2/models/" +
      modelId +
      "/versions/" +
      modelVersionId +
      "/outputs",
    requestOptions
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      return response.json();
    })
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json("Unable to work with API"));
};

const handleImage = (req, res, db) => {
  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      res.json(entries[0].entries);
    })
    .catch((err) => res.status(400).send("Unable to get entries"));
};

module.exports = {
  handleImage,
  handleAPICall,
};
