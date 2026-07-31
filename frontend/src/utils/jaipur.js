// ── Jaipur Places Database ──────────────────────────────────────────────────
// Full list of landmarks, markets, hospitals, stations, malls & colleges
// Each entry: { name, lat, lng, icon, category, area }

export const JAIPUR_PLACES = [
  // ── Tourist landmarks ──────────────────────────────────────────────
  { name: 'Hawa Mahal',                lat: 26.9239, lng: 75.8267, icon: '🏯', category: 'landmark',  area: 'Old City'      },
  { name: 'Amer Fort',                  lat: 26.9855, lng: 75.8513, icon: '🏰', category: 'landmark',  area: 'Amer'          },
  { name: 'City Palace',                lat: 26.9257, lng: 75.8237, icon: '🏛️', category: 'landmark',  area: 'Old City'      },
  { name: 'Jantar Mantar',              lat: 26.9247, lng: 75.8242, icon: '🔭', category: 'landmark',  area: 'Old City'      },
  { name: 'Albert Hall Museum',         lat: 26.9115, lng: 75.8193, icon: '🏛️', category: 'landmark',  area: 'Ram Niwas Bagh'},
  { name: 'Nahargarh Fort',             lat: 26.9430, lng: 75.8030, icon: '🏰', category: 'landmark',  area: 'Nahargarh'     },
  { name: 'Jaigarh Fort',               lat: 26.9918, lng: 75.8431, icon: '🏰', category: 'landmark',  area: 'Amer'          },
  { name: 'Jal Mahal',                  lat: 26.9500, lng: 75.8461, icon: '🏯', category: 'landmark',  area: 'Man Sagar'     },
  { name: 'Patrika Gate',               lat: 26.8598, lng: 75.8087, icon: '🌸', category: 'landmark',  area: 'Jawahar Circle'},
  { name: 'Birla Mandir',               lat: 26.8990, lng: 75.8143, icon: '⛩️', category: 'temple',    area: 'Statue Circle' },
  { name: 'Govind Dev Ji Temple',       lat: 26.9261, lng: 75.8205, icon: '⛩️', category: 'temple',    area: 'Old City'      },
  { name: 'Sisodia Rani Garden',        lat: 26.9104, lng: 75.8695, icon: '🌳', category: 'park',      area: 'Agra Road'     },
  { name: 'Central Park Jaipur',        lat: 26.9060, lng: 75.7946, icon: '🌳', category: 'park',      area: 'C-Scheme'      },
  { name: 'Jawahar Circle Garden',      lat: 26.8598, lng: 75.8087, icon: '🌳', category: 'park',      area: 'Jawahar Circle'},
  { name: 'Chokhi Dhani',               lat: 26.7971, lng: 75.8388, icon: '🎡', category: 'leisure',   area: 'Tonk Road'     },

  // ── Markets & Shopping ─────────────────────────────────────────────
  { name: 'Johari Bazaar',              lat: 26.9201, lng: 75.8268, icon: '💍', category: 'market',    area: 'Old City'      },
  { name: 'Bapu Bazaar',                lat: 26.9175, lng: 75.8254, icon: '🛍️', category: 'market',    area: 'Old City'      },
  { name: 'Nehru Bazaar',               lat: 26.9178, lng: 75.8231, icon: '🛍️', category: 'market',    area: 'Old City'      },
  { name: 'Tripolia Bazaar',            lat: 26.9213, lng: 75.8220, icon: '🛍️', category: 'market',    area: 'Old City'      },
  { name: 'MI Road',                    lat: 26.9151, lng: 75.8093, icon: '🛣️', category: 'landmark',  area: 'MI Road'       },
  { name: 'Pink Square Mall',           lat: 26.9085, lng: 75.7878, icon: '🏬', category: 'mall',      area: 'Mansarovar'    },
  { name: 'World Trade Park',           lat: 26.8956, lng: 75.8050, icon: '🏬', category: 'mall',      area: 'JLN Marg'      },
  { name: 'Crystal Palm Mall',          lat: 26.9138, lng: 75.7593, icon: '🏬', category: 'mall',      area: 'Nirman Nagar'  },
  { name: 'Gaurav Tower',               lat: 26.8956, lng: 75.8059, icon: '🏢', category: 'mall',      area: 'Malviya Nagar' },
  { name: 'Elements Mall',              lat: 26.8530, lng: 75.7963, icon: '🏬', category: 'mall',      area: 'Ajmer Road'    },

  // ── Transport hubs ─────────────────────────────────────────────────
  { name: 'Jaipur Railway Station',     lat: 26.9198, lng: 75.7880, icon: '🚂', category: 'transport', area: 'Station Road'  },
  { name: 'Gandhinagar Railway Station',lat: 26.9271, lng: 75.7974, icon: '🚂', category: 'transport', area: 'Gandhinagar'   },
  { name: 'Jaipur International Airport',lat:26.8242, lng: 75.8122, icon: '✈️', category: 'transport', area: 'Sanganer'      },
  { name: 'Sindhi Camp Bus Stand',      lat: 26.9182, lng: 75.7897, icon: '🚌', category: 'transport', area: 'Station Road'  },
  { name: 'Narayan Singh Bus Stand',    lat: 26.9127, lng: 75.8133, icon: '🚌', category: 'transport', area: 'Old City'      },

  // ── Hospitals ──────────────────────────────────────────────────────
  { name: 'SMS Hospital',               lat: 26.9095, lng: 75.8119, icon: '🏥', category: 'hospital',  area: 'JLN Marg'      },
  { name: 'Sawai Man Singh Hospital',   lat: 26.9095, lng: 75.8119, icon: '🏥', category: 'hospital',  area: 'JLN Marg'      },
  { name: 'Fortis Escorts Hospital',    lat: 26.8773, lng: 75.8164, icon: '🏥', category: 'hospital',  area: 'Malviya Nagar' },
  { name: 'Narayana Multispeciality',   lat: 26.8419, lng: 75.8101, icon: '🏥', category: 'hospital',  area: 'Sanganer'      },
  { name: 'Manipal Hospital Jaipur',    lat: 26.8558, lng: 75.8044, icon: '🏥', category: 'hospital',  area: 'Amer Road'     },
  { name: 'NIMS Hospital',              lat: 26.8467, lng: 75.7698, icon: '🏥', category: 'hospital',  area: 'Shobha Nagar'  },

  // ── Colleges & Universities ────────────────────────────────────────
  { name: 'University of Rajasthan',    lat: 26.9124, lng: 75.7873, icon: '🎓', category: 'education', area: 'JLN Marg'      },
  { name: 'MNIT Jaipur',                lat: 26.8612, lng: 75.8178, icon: '🎓', category: 'education', area: 'JLN Marg'      },
  { name: 'IIT Jodhpur (Jaipur Campus)',lat: 26.8514, lng: 75.7964, icon: '🎓', category: 'education', area: 'Ajmer Road'    },
  { name: 'Jaipur National University', lat: 26.8288, lng: 75.8114, icon: '🎓', category: 'education', area: 'Jagatpura'     },
  { name: 'Poornima University',        lat: 26.8097, lng: 75.8200, icon: '🎓', category: 'education', area: 'ISI'           },
  { name: 'LBS College Jaipur',         lat: 26.9055, lng: 75.8018, icon: '🎓', category: 'education', area: 'Lal Bahadur Nagar'},

  // ── Popular areas / localities ─────────────────────────────────────
  { name: 'C-Scheme',                   lat: 26.9058, lng: 75.7946, icon: '📍', category: 'area',      area: 'C-Scheme'      },
  { name: 'Malviya Nagar',              lat: 26.8656, lng: 75.8167, icon: '📍', category: 'area',      area: 'South Jaipur'  },
  { name: 'Vaishali Nagar',             lat: 26.9100, lng: 75.7333, icon: '📍', category: 'area',      area: 'West Jaipur'   },
  { name: 'Mansarovar',                 lat: 26.9042, lng: 75.7774, icon: '📍', category: 'area',      area: 'West Jaipur'   },
  { name: 'Jagatpura',                  lat: 26.8288, lng: 75.8114, icon: '📍', category: 'area',      area: 'South Jaipur'  },
  { name: 'Tonk Road',                  lat: 26.8656, lng: 75.8100, icon: '📍', category: 'area',      area: 'South Jaipur'  },
  { name: 'Ajmer Road',                 lat: 26.9100, lng: 75.7200, icon: '📍', category: 'area',      area: 'West Jaipur'   },
  { name: 'Sikar Road',                 lat: 26.9700, lng: 75.7700, icon: '📍', category: 'area',      area: 'North Jaipur'  },
  { name: 'Gopalpura Bypass',           lat: 26.8750, lng: 75.7800, icon: '📍', category: 'area',      area: 'South-West'    },
  { name: 'Raja Park',                  lat: 26.8974, lng: 75.8296, icon: '📍', category: 'area',      area: 'Central'       },
  { name: 'Vidhyadhar Nagar',           lat: 26.9541, lng: 75.8019, icon: '📍', category: 'area',      area: 'North Jaipur'  },
  { name: 'Sanganer',                   lat: 26.8419, lng: 75.8101, icon: '📍', category: 'area',      area: 'South Jaipur'  },
  { name: 'Bagru',                      lat: 26.8208, lng: 75.6322, icon: '📍', category: 'area',      area: 'West Jaipur'   },
  { name: 'Sodala',                     lat: 26.9293, lng: 75.7676, icon: '📍', category: 'area',      area: 'Central'       },
  { name: 'Pratap Nagar',               lat: 26.8480, lng: 75.8060, icon: '📍', category: 'area',      area: 'South Jaipur'  },
];

// ── Haversine distance (km) ─────────────────────────────────────────────────
export const distKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

/**
 * Returns places sorted by distance from user, filtered by optional query.
 * Falls back to alphabetical if no user location given.
 *
 * @param {string}  query      - Search text (empty = all)
 * @param {number}  userLat    - User latitude  (optional)
 * @param {number}  userLng    - User longitude (optional)
 * @param {number}  limit      - Max results
 * @returns {Array}            - Sorted place objects with .distKm added
 */
export const getNearbyPlaces = (query = '', userLat = null, userLng = null, limit = 8) => {
  const q = query.trim().toLowerCase();
  let places = q
    ? JAIPUR_PLACES.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.area.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      )
    : [...JAIPUR_PLACES];

  if (userLat !== null && userLng !== null) {
    places = places.map(p => ({
      ...p,
      dist: distKm(userLat, userLng, p.lat, p.lng),
    })).sort((a, b) => a.dist - b.dist);
  }

  return places.slice(0, limit);
};

// ── Quick-access popular spots (for chips / recent) ────────────────────────
export const QUICK_SPOTS = [
  { name: 'Jaipur Airport',      icon: '✈️' },
  { name: 'Jaipur Railway Station', icon: '🚂' },
  { name: 'Hawa Mahal',          icon: '🏯' },
  { name: 'Amer Fort',           icon: '🏰' },
  { name: 'World Trade Park',    icon: '🏬' },
  { name: 'SMS Hospital',        icon: '🏥' },
  { name: 'MI Road',             icon: '🛣️' },
  { name: 'Sindhi Camp',         icon: '🚌' },
];

// ── City centre coords ──────────────────────────────────────────────────────
export const JAIPUR_CENTER = { lat: 26.9124, lng: 75.7873 };
