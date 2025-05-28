export type LatLng = number[];

export interface AddressProperties {
  _type: string;
  banId: string;
  /** Ville : « Chambéry ». */
  city: string;
  /** Code INSEE de la commune : « 73065 ». */
  citycode: string;
  /** Chaîne « département, région » : « 73, Savoie, Auvergne-Rhône-Alpes ». */
  context: string;
  /** Numéro dans la voie : « 72 » (facultatif dans certains résultats). */
  housenumber?: string;
  /** Identifiant alphanumérique BAN : « 73065_0770_00072 ». */
  id: string;
  /** Pondération interne Addok pour départager deux scores identiques. */
  importance?: number;
  /** Libellé lisible avec code postal : « 72 Chemin de … ». */
  label: string;
  /** Nom de la voie sans CP : « 72 Chemin de Charrière-Neuve ». */
  name: string;
  /** Code postal : « 73000 ». */
  postcode: string;
  /** Score de pertinence 0-1 par rapport à la requête. */
  score?: number;
  /** Nom de rue seul : « Chemin de Charrière-Neuve ». */
  street?: string;
  /** Type de résultat : `housenumber`, `street`, `locality`, … */
  type?: string;
  /** Coordonnées projetées (Lambert 93) si renvoyées. */
  x?: number;
  y?: number;
  /** Adresse formatée (ex: 10 rue de la paix). */
  formatted?: string;
}

export interface AddressGeometry {
  /** Coordonnées géographiques (WGS84) de l'adresse. */
  coordinates: LatLng;
  /** Type de géométrie : `Point`, `LineString`, `Polygon`, … */
  type: string;
}

export interface Address {
  properties: AddressProperties;
  geometry: AddressGeometry;
}

export interface estimationFormInfo {
  surface_batie?: number | null;
  surface_habitable?: number | null;
  rooms?: number | null;
  renovation_discount?: number | null;
  type_local?: string | null;
  DPE?: string | null;
  ground_floor?: boolean | null;
  equipments?: string[] | null; // tableau → jsonb
  discalifications?: string[] | null; // tableau → jsonb
}

// series provided to the bar chart
export interface BarSeriesItem {
  name: string;
  type: "bar";
  data: number[];
  itemStyle: { color: string };
}
