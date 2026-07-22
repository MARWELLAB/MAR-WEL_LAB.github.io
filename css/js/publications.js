fetch("data/publications.json")
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById("publicationContainer");
    const searchBox = document.getElementById("searchPublication");
    const journalFilter = document.getElementById("journalFilter");

    // Update statistics
    document.getElementById("paperCount").textContent = data.length;

    const journals = [...new Set(data.map(pub => pub.journal))].sort();
    document.getElementById("journalCount").textContent = journals.length;

    journals.forEach(journal => {
      const option = document.createElement("option");
      option.value = journal;
      option.textContent = journal;
      journalFilter.appendChild(option);
    });

    function displayPublications(list) {
      container.innerHTML = "";

      list.forEach(pub => {
        const item = document.createElement("div");
        item.className = "pub-item";

        item.innerHTML = `
          <div class="pub-title">${pub.title}</div>
          <div class="pub-authors">${pub.authors}</div>
          <div class="pub-journal">${pub.journal}</div>
          <span class="pub-year">${pub.year}</span>
          ${pub.doi ? `
            <a href="${pub.doi}" target="_blank" class="pub-doi">DOI</a>
          ` : ""}
        `;

        container.appendChild(item);
      });
    }

    function filterPublications() {
      const searchText = searchBox.value.toLowerCase();
      const selectedJournal = journalFilter.value;

      const filtered = data.filter(pub => {
        const matchesSearch =
          pub.title.toLowerCase().includes(searchText) ||
          pub.authors.toLowerCase().includes(searchText) ||
          pub.journal.toLowerCase().includes(searchText) ||
          pub.year.includes(searchText);

        const matchesJournal =
          selectedJournal === "all" ||
          pub.journal === selectedJournal;

        return matchesSearch && matchesJournal;
      });

      displayPublications(filtered);
    }

    searchBox.addEventListener("input", filterPublications);
    journalFilter.addEventListener("change", filterPublications);

    displayPublications(data);
  })
  .catch(error => {
    console.error("Error loading publications:", error);
  });
