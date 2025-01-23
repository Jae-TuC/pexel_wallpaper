const apikey = "UuW73Px4Upl3HwOBIXTKFtFsjiI2oB0rHIj7AriSTiZMZaN7wbwGRlLC";

const photos = async () => {
   return await fetch("https://api.pexels.com/v1/search?query=people",{
        headers: {
          'Authorization': apikey
        }
      })
         .then(resp => {
            console.log(resp)
           return resp.json()
         })
         .then(data => {
           console.log(data.photos)
         })
};

// Call the function
photos()