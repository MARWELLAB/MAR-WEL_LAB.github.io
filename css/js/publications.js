document.addEventListener("DOMContentLoaded", () => {

    const container = document.getElementById("publicationContainer");
    const searchBox = document.getElementById("searchPublication");
    const journalFilter = document.getElementById("journalFilter");

    let publications = [];

    fetch("data/publications.json")
        .then(response => response.json())
        .then(data => {

            publications = data;

            updateStatistics(publications);

            populateJournalFilter(publications);

            renderPublications(publications);

        });

    function updateStatistics(data) {

        document.getElementById("paperCount").textContent = data.length;

        const journals = [...new Set(data.map(p => p.journal))];
        document.getElementById("journalCount").textContent = journals.length;

        const years = data.map(p => p.year);
        const maxYear = Math.max(...years);
        const minYear = Math.min(...years);

        document.getElementById("yearCount").textContent =
            `${minYear} - ${maxYear}`;
    }

    function populateJournalFilter(data) {

        const journals =
            [...new Set(data.map(p => p.journal))].sort();

        journals.forEach(journal => {

            const option = document.createElement("option");

            option.value = journal;

            option.textContent = journal;

            journalFilter.appendChild(option);

        });

    }

    function renderPublications(data) {

        container.innerHTML = "";

        const years =
            [...new Set(data.map(p => p.year))]
            .sort((a, b) => b - a);

        years.forEach(year => {

            const heading = document.createElement("h2");
            heading.className = "publication-year";
            heading.textContent = year;

            container.appendChild(heading);

            data.filter(p => p.year === year)
                .forEach(pub => {

                    const card = document.createElement("div");

                    card.className = "pub-item";

                    card.innerHTML = `

                        <div class="pub-title">
                            ${pub.title}
                        </div>

                        <div class="pub-authors">
                            ${highlightAuthor(pub.authors)}
                        </div>

                        <div class="pub-journal">
                            <em>${pub.journal}</em>

                            ${pub.volume ? ", Vol. " + pub.volume : ""}

                            ${pub.pages ? ", " + pub.pages : ""}
                        </div>

                        <div class="pub-buttons">

                            ${pub.doi
                                ? `<a class="doi-btn"
                                     href="${pub.doi}"
                                     target="_blank">
                                     DOI
                                   </a>`
                                : ""}

                        </div>

                    `;

                    container.appendChild(card);

                });

        });

    }

    function highlightAuthor(authors) {

        return authors.replace(
            /Vijay\s*K\.?\s*G\.?/gi,
            "<strong>Vijay K. G.</strong>"
        );

    }

    function applyFilters() {

        const search =
            searchBox.value.toLowerCase();

        const journal =
            journalFilter.value;

        const filtered = publications.filter(pub => {

            const text = (

                pub.title +

                " " +

                pub.authors +

                " " +

                pub.journal +

                " " +

                pub.year

            ).toLowerCase();

            const matchesSearch =
                text.includes(search);

            const matchesJournal =
                journal === "all" ||
                pub.journal === journal;

            return matchesSearch && matchesJournal;

        });

        renderPublications(filtered);

    }

    searchBox.addEventListener("input", applyFilters);

    journalFilter.addEventListener("change", applyFilters);

});
