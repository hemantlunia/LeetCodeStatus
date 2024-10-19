document.addEventListener("DOMContentLoaded", function () {
  const searchButton = document.getElementById("search-btn");
  const usernameInput = document.getElementById("user-input");
  const statsContainer = document.querySelector(".stats-container");
  const easyProgressCircle = document.querySelector(".easy-progress");
  const mediumProgressCircle = document.querySelector(".medium-progress");
  const hardProgressCircle = document.querySelector(".hard-progress");
  const easyLabel = document.getElementById("easy-label");
  const mediumLabel = document.getElementById("medium-label");
  const hardLabel = document.getElementById("hard-label");
  const cardStatsContainer = document.querySelector(".stats-card");
  const heading = document.querySelector("#heading");

  // validate leetcode username
  function validateUsername(username) {
    if (username.trim() === "") {
      alert("Please Type username");
      return false;
    }
    const regex = /^(?![_-])(?!.*[_-]{2})[a-zA-Z0-9_-]{1,15}(?<![_-])$/;
    const isMatching = regex.test(username);
    if (!isMatching) {
      alert("Please Provide Valid username");
      return false;
    }
    return isMatching;
  }

  async function fetchUserdetails(username) {
    const url = `https://leetcode-stats-api.herokuapp.com/${username}`;

    try {
      searchButton.textContent = "Searching...";
      searchButton.disabled = true;
      const response = await fetch(url);
      // console.log(response);
      document.querySelector("#progrees-bar").style.display = "flex";

      if (!response.ok) {
        throw new Error("Unable to fetch the user Details");
      }
      const userdata = await response.json();
      heading.textContent = `${username}, LeetCode Status!`;
      heading.style.color = "yellow";
      // console.log("User Data : ", userdata.submissionCalendar);
      displayUserData(userdata);
    } catch (error) {
      // console.log(error);

      statsContainer.innerHTML = `<p>${error.message}</p>`;
    } finally {
      searchButton.textContent = "Search";
      searchButton.disabled = false;
      usernameInput.value = "";
    }
  }

  function updateProgress(solved, total, label, circle) {
    const progressDegree = (solved / total) * 100;
    // console.log(progressDegree);

    circle.style.setProperty("--progress-degree", `${progressDegree}%`);
    label.textContent = `${solved}/${total}`;
  }

  function displayUserData(userdata) {
    const totalQues = userdata.totalQuestions;
    const totalEasyQues = userdata.totalEasy;
    const totalmediumQues = userdata.totalMedium;
    const totalHardQues = userdata.totalHard;

    const solvedTotalQues = userdata.totalSolved;
    const solvedTotalEasyQues = userdata.easySolved;
    const solvedTotalmediumQues = userdata.mediumSolved;
    const solvedTotalHardQues = userdata.hardSolved;

    updateProgress(
      solvedTotalEasyQues,
      totalEasyQues,
      easyLabel,
      easyProgressCircle
    );
    updateProgress(
      solvedTotalHardQues,
      totalHardQues,
      hardLabel,
      hardProgressCircle
    );
    updateProgress(
      solvedTotalmediumQues,
      totalmediumQues,
      mediumLabel,
      mediumProgressCircle
    );

    const cartData = [
      {
        label: "Overall Questions",
        value: totalQues,
      },
      {
        label: "Total Solved",
        value: solvedTotalQues,
      },
      {
        label: "Acceptance Rate",
        value: userdata.acceptanceRate + "%",
      },
      {
        label: "Ranking",
        value: userdata.ranking,
      },
    ];

    cardStatsContainer.innerHTML = cartData
      .map((data) => {
        return `
      <div class="card">
      <h4>${data.label}</h4>
      <p>${data.value}</p>
      </div>
      `;
      })
      .join("");

    // submissin Date
    function convertTimestampToDate(timestamp) {
      const date = new Date(timestamp * 1000); 
      return date.toLocaleDateString("en-GB",{
        day:"numeric",
        month: "long",
        year: "numeric"
      });
    }

    const SubmitionDate = userdata.submissionCalendar;

    const tableRows = Object.keys(SubmitionDate)
      .reverse()
      .slice(0,8)
      .map((key) => {
        return `
        <tr>
          <td>${convertTimestampToDate(key)}</td>
          <td>${SubmitionDate[key]}</td>
        </tr>
      `;
      })
      .join(""); 

    const tableHTML = ` <h2 style="color:red;">Last 8 Submissions</h2>
      <table id="timestampsTable">
        <thead>
          <tr>
            <th>Submission Date</th>
            <th>Submission Value</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    `;

    document.getElementById("tableContainer").innerHTML = tableHTML;
  }

  searchButton.addEventListener("click", function () {
    const username = usernameInput.value;
    // console.log("username : ", username);
    if (validateUsername(username)) {
      fetchUserdetails(username);
    }
  });
});
