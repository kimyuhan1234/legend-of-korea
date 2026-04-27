/**
 * P3B-4: 카테고리별 Schema.org JSON-LD.
 *
 * 페이지 성격에 따라 schema.org type 매핑:
 *   - lodging  → LodgingBusiness  (/stay 안내 허브)
 *   - food     → FoodEstablishment (/food K-Food 카테고리)
 *   - attraction → TouristAttraction (/sights 명소)
 *   - trip     → TouristTrip (/courses/[id] 코스)
 *   - product  → Product (/pass 패스 상품)
 *   - event    → Event (스페셜 이벤트, 후속)
 *
 * Google Rich Results Test:
 *   https://search.google.com/test/rich-results
 *
 * Schema.org Validator:
 *   https://validator.schema.org/
 */

export type CategorySchemaType = 'lodging' | 'food' | 'attraction' | 'trip' | 'product' | 'event'

export interface CategorySchemaProps {
  type: CategorySchemaType
  name: string
  description: string
  url: string
  /** 절대 또는 사이트 기준 상대 이미지 경로 */
  image?: string
  /** Product 전용 — 가격 정보 */
  price?: { amount: number; currency: string }
  /** LodgingBusiness 전용 — 위치 */
  location?: { name?: string; addressCountry: string }
  /** TouristTrip 전용 — 코스 길이 (시간) */
  duration?: string
}

interface SchemaBase {
  '@context': string
  '@type': string
  name: string
  description: string
  url: string
  image?: string
}

interface ProductOffer {
  offers: {
    '@type': 'Offer'
    price: number
    priceCurrency: string
    availability: 'https://schema.org/InStock'
  }
}

interface LocationData {
  address: {
    '@type': 'PostalAddress'
    addressLocality?: string
    addressCountry: string
  }
}

interface FoodCuisine {
  servesCuisine: string
}

interface TripDuration {
  duration: string
}

type CategorySchema = SchemaBase &
  Partial<ProductOffer> &
  Partial<LocationData> &
  Partial<FoodCuisine> &
  Partial<TripDuration>

const TYPE_MAP: Record<CategorySchemaType, string> = {
  lodging: 'LodgingBusiness',
  food: 'FoodEstablishment',
  attraction: 'TouristAttraction',
  trip: 'TouristTrip',
  product: 'Product',
  event: 'Event',
}

export function CategorySchema(props: CategorySchemaProps) {
  const schema: CategorySchema = {
    '@context': 'https://schema.org',
    '@type': TYPE_MAP[props.type],
    name: props.name,
    description: props.description,
    url: props.url,
    image: props.image,
  }

  if (props.type === 'food') {
    schema.servesCuisine = 'Korean'
  }

  if (props.type === 'lodging' && props.location) {
    schema.address = {
      '@type': 'PostalAddress',
      addressLocality: props.location.name,
      addressCountry: props.location.addressCountry,
    }
  }

  if (props.type === 'product' && props.price) {
    schema.offers = {
      '@type': 'Offer',
      price: props.price.amount,
      priceCurrency: props.price.currency,
      availability: 'https://schema.org/InStock',
    }
  }

  if (props.type === 'trip' && props.duration) {
    schema.duration = props.duration
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema).replace(/</g, '\\u003c'),
      }}
    />
  )
}
