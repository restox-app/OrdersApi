export interface RESTAURANTS_SCHEMA extends Document {
  name: string,
  email: string,
  contact: string,
  address: {
    line1: string
    line2?: string
    city: string
    state: string
    pin_code: string
  },
}
