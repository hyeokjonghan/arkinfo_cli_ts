import React from 'react'
import IndexCard from './indexCard'

describe('<IndexCard />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<IndexCard />)
  })
})