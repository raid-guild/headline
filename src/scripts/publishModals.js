const schema = require("../schemas/publication.json");
const { exec } = require("child_process");
const util = require("util");
const execP = util.promisify(exec);

const escapedSchema = JSON.stringify(schema);

execP(
  `glaze model:add publication schema Publication '${escapedSchema}' --key 0671b029ec676a6e87204cfe550205f832c8c0ca7eb339b8c458ff22bc7a0d63
`
)
  .then((resp) => {
    console.log("Contributor Profile");
    console.log(resp.stdout);
    console.error(resp.stderr);
    execP(
      `glaze model:export publication ../schemas/published/publication.json
`
    )
      .then((resp) => {
        console.log("Export Profile");
        console.log(resp.stdout);
        console.error(resp.stderr);
      })
      .catch((err) => {
        console.error(err);
      });
    execP(`glaze model:publish publication`)
      .then((resp) => {
        console.log("Export Profile");
        console.log(resp.stdout);
        console.error(resp.stderr);
      })
      .catch((err) => {
        console.error(err);
      });
  })
  .catch((err) => {
    console.error(err);
  });

execP(
  `glaze model:export publication ../schemas/published/publication.json
`
)
  .then((resp) => {
    console.log("Contributor Profile");
    console.log(resp.stdout);
    console.error(resp.stderr);
  })
  .catch((err) => {
    console.error(err);
  });

// execP(`idx schema:publish ${did} '${escapedContributorsCSVSchema}'`)
//   .then((resp) => {
//     console.log("Contributor CSV");
//     console.log(resp.stdout);
//     console.error(resp.stderr);
//   })
//   .catch((err) => {
//     console.error(err);
//   });

// execP(`idx schema:publish ${did} '${escapedGuildCSVMappingSchema}'`)
//   .then((resp) => {
//     console.log("Guild to CSV mapping");
//     console.log(resp.stdout);
//     console.error(resp.stderr);
//   })
//   .catch((err) => {
//     console.error(err);
//   });
