const typeColors = {
    normal: "#A8A77A",
    fire: "#EE8130",
    water: "#6390F0",
    electric: "#F7D02C",
    grass: "#7AC74C",
    ice: "#96D9D6",
    fighting: "#C22E28",
    poison: "#A33EA1",
    ground: "#E2BF65",
    flying: "#A98FF3",
    psychic: "#F95587",
    bug: "#A6B91A",
    rock: "#B6A136",
    ghost: "#735797",
    dragon: "#6F35FC",
    dark: "#705746",
    steel: "#B7B7CE",
    fairy: "#D685AD"
};

// lightest Pokemon
const chartLightest = document.getElementById('pokemonChartLightest').getContext('2d');
const pokemonChartlightest = new Chart(chartLightest, {
    type: 'bar',
    data: {
        labels: ['Gastly', 'Haunter', 'Flabebe', 'Cosmog', 'Kartana', 'Gimmighoul', 'Cutiefly', 'Sinistea', 'Rotom', 'Uxie'],
        datasets: [{
            label: 'weight in kg',
            data: [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.2, 0.3, 0.3, 0.3],
            backgroundColor: [
                typeColors['ghost'], // Gastly
                typeColors['ghost'], // Haunter
                typeColors['fairy'], // Flabebe
                typeColors['psychic'], // Cosmog
                typeColors['grass'], // Kartana
                typeColors['ghost'], // Gimmighoul
                typeColors['bug'], // Cutiefly
                typeColors['ghost'], // Sinistea
                typeColors['electric'], // Rotom
                typeColors['psychic'] // Uxie
            ],
            borderWidth: 0,
            borderRadius: 4,
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false, 
        indexAxis: 'y',
        scales: {
            y: {
                grid: {
                    display: false
                },
                ticks: {
                    color: "#ffffff",
                }
            },
            x: {
                beginAtZero: true,
                ticks: {
                    color: "#ffffff",
                    stepSize: 0.05
                }
            }
        },
        plugins: {
            tooltip: {
                enabled: true,
                callbacks: {
                    label: function(tooltipItem) {
                        const typeIndex = tooltipItem.dataIndex;
                        const pokemonTypes = [
                            'ghost', 'ghost', 'fairy', 'psychic', 'grass', 'ghost', 'bug', 'ghost', 'electric', 'psychic'
                        ];
                        const pokemonType = pokemonTypes[typeIndex];
                        return 'type: (' + pokemonType + ') | weight: ' + tooltipItem.raw + ' kg';
                    }
                }
            },
            legend: {
                display: false,
                labels: {
                    boxWidth: 0,
                    font: {
                        size: 14
                    }
                }
            }
        }
    }
});

// heaviest Pokemon
const chartHeaviest = document.getElementById('pokemonChartHeaviest').getContext('2d');
const pokemonChartHeaviest = new Chart(chartHeaviest, {
    type: 'bar',
    data: {
        labels: ['Celesteela', 'Cosmoem', 'Eternatus', 'Groudon', 'Mudsdale', 'Guzzlord', 'Dialga', 'Stakataka', 'Glastrier', 'Melmetal'],
        datasets: [{
            label: 'weight in kg',
            data: [999.9, 999.9, 950, 950, 920, 888, 848.7, 820, 800, 800],
            backgroundColor: [
                typeColors['steel'], // Celesteela
                typeColors['psychic'], // Cosmoem
                typeColors['poison'], // Eternatus
                typeColors['ground'], // Groudon
                typeColors['ground'], // Mudsdale
                typeColors['dark'], // Guzzlord
                typeColors['steel'], // Dialga
                typeColors['rock'], // Stakataka
                typeColors['ice'], // Glastrier
                typeColors['steel'] // Melmetal
            ],
            borderWidth: 0
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false, 
        indexAxis: 'y',
        scales: {
            y: {
                grid: {
                    display: false
                },
                ticks: {
                    color: "#ffffff",
                }
            },
            x: {
                beginAtZero: true,
                ticks: {
                    color: "#ffffff",
                    stepSize: 100
                }
            }
        },
        plugins: {
            tooltip: {
                enabled: true,
                callbacks: {
                    label: function(tooltipItem) {
                        const typeIndex = tooltipItem.dataIndex;
                        const pokemonTypes = [
                            'steel', 'psychic', 'poison', 'ground', 'ground', 'dark', 'steel', 'rock', 'ice', 'steel'
                        ];
                        const pokemonType = pokemonTypes[typeIndex];
                        return 'type: (' + pokemonType + ') | weight: ' + tooltipItem.raw + ' kg';
                    }
                }
            },
            legend: {
                display: false
            }
        }
    },
});


// smallest Pokemon
const chartSmallest = document.getElementById('pokemonBySizeSmall').getContext('2d');
const pokemonChartSmallest = new Chart(chartSmallest, {
    type: 'bar',
    data: {
        labels: ['Joltik', 'Flabebe', 'Cutiefly', 'Comfey', 'Cosmoem', 'Sinistea', 'Poltchageist', 'Diglett', 'Natu', 'Azurill'],
        datasets: [{
            label: 'height in m',
            data: [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.2, 0.2, 0.2],
            backgroundColor: [
                typeColors['bug'], // Joltik
                typeColors['fairy'], // Flabebe
                typeColors['bug'], // Cutiefly
                typeColors['fairy'], // Comfey
                typeColors['psychic'], // Cosmoem
                typeColors['ghost'], // Sinistea
                typeColors['grass'], // Poltchageist
                typeColors['ground'], // Diglett
                typeColors['psychic'], // Natu
                typeColors['normal'] // Azurill
            ],
            borderWidth: 0
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false, 
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    color: "#ffffff",
                    stepSize: 0.05
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: "#ffffff",
                    font: {
                        size: 14
                    },
                    maxRotation: 45,
                    autoSkip: false
            }},
        },
        plugins: {
            legend: {
                display: false
            }
        }
    }
});


// biggest pokemon
const ctx = document.getElementById('pokemonBySizeBig').getContext('2d');
const pokemonChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Eternatus', 'Wailord', 'Dondozo', 'Celesteela', 'Steelix', 'Onix', 'Rayquaza', 'Gyarados', 'Milotic', 'Yveltal'],
        datasets: [{
            label: 'height in m',
            data: [20, 14.5, 12, 9.2, 9.2, 8.8, 7, 6.5, 6.2, 5.8],
            backgroundColor: [
                typeColors['poison'], // Eternatus
                typeColors['water'], // Wailord
                typeColors['water'], // Dondozo
                typeColors['steel'], // Celesteela
                typeColors['steel'], // Steelix
                typeColors['rock'], // Onix
                typeColors['dragon'], // Rayquaza
                typeColors['water'], // Gyarados
                typeColors['water'], // Milotic
                typeColors['dark'] // Yveltal
            ],
            borderWidth: 0
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false, 
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    color: "#ffffff",
                    stepSize: 5
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: "#ffffff",
                    font: {
                        size: 14
                    },
                    maxRotation: 45,
                    autoSkip: false
            }},
        },
        plugins: {
            legend: {
                display: false
            }
        }
    }
});

// pokemon by primary type
const primaryTypeContainer = document.getElementById('pokemonByPrimaryType').getContext('2d');
new Chart(primaryTypeContainer, {
    type: 'doughnut',
    data: {
        labels: [
            "Normal", "Fire", "Water", "Electric", "Grass", "Ice", "Fighting", 
            "Poison", "Ground", "Flying", "Psychic", "Bug", "Rock", 
            "Ghost", "Dragon", "Dark", "Steel", "Fairy"
        ],
        datasets: [{
            label: "Pokémon by type",
            data: [136, 80, 157, 92, 115, 43, 57, 51, 47, 13, 83, 93, 81, 51, 52, 59, 49, 33],
            backgroundColor: [
                "#A8A77A", "#EE8130", "#6390F0", "#F7D02C", "#7AC74C", "#96D9D6",
                "#C22E28", "#A33EA1", "#E2BF65", "#A98FF3", "#F95587", "#A6B91A",
                "#B6A136", "#735797", "#6F35FC", "#705746", "#B7B7CE", "#D685AD"
            ],
            borderWidth: 2,
            borderColor: "rgb(27, 31, 52)",
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                align: 'left',
                maxWidth: 10,
                labels: {
                    color: "#ffffff",
                    boxWidth: 10,
                    padding: 10,  
                },
            }
        },
        
    }
});


// pokemon by region
const ctx5 = document.getElementById('pokemonLineChart').getContext('2d');
const pokemonLineChart = new Chart(ctx5, {
    type: 'line',
    data: {
        labels: ['Kanto', 'Johto', 'Hoenn', 'Sinnoh', 'Ext. Sinnoh', 'Upd. Johto', 'Unova', 'Upd. Unova', 'Conquest', 'Kalos-Central', 'Kalos-Coastal', 'Kalos-Mountain', 'Upd. Hoenn', 'Alola', 'Melemele', 'Akala', 'Ulaula', 'Poni', 'Upd. Ulaula'],
        datasets: [{
            label: 'Count',
            data: [151, 251, 202, 151, 210, 256, 156, 301, 200, 150, 153, 151, 211, 302, 120, 130, 130, 100, 403],
            fill: false,
            borderWidth: 3,  
            borderColor: "#ffcc00",
            tension: 0.1,
            pointRadius: 3, 
            pointHoverRadius: 7
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,  
        scales: {
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: "#ffffff",
                    font: {
                        size: 12 
                    },
                    maxRotation: 45, 
                    autoSkip: false 
                }
            },
            y: {
                beginAtZero: true,
                ticks: {
                    color: "#ffffff",
                    stepSize: 50,
                    font: {
                        size: 12
                    }
                },
                grid: {
                    display: true,
                }
            }
        },
        plugins: {
            legend: {
                display: false
            }
        }
    }
});
