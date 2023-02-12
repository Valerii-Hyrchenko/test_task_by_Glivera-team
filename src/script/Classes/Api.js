class Api {
  preloader(show) {
    if (show) {
      document.getElementById("preloader").style.display = "block";
    } else {
      document.getElementById("preloader").style.display = "none";
    }
  }
  get = async ({ endpoint }) => {
    try {
      const response = await fetch(endpoint);
      if (response.ok) {
        const resultRequest = await response.json();
        this.resultGetRequest = resultRequest;
      } else {
        throw new Error(`There was an error code ${response.status}`);
      }
    } catch (error) {
      //in a real project, here would create an instance of the class (or his method) responsible for the modal window with the error message
      throw new Error(error.message);
    }
  };

  patch = async ({ endpoint, body }) => {
    try {
      const response = await fetch(endpoint, {
        method: "PATCH",
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new Error(`There was an error code ${response.status}`);
      }
    } catch (error) {
      //in a real project, here would create an instance of the class (or his method) responsible for the modal window with the error message
      throw new Error(error.message);
    }
  };
}

export const API = new Api();
