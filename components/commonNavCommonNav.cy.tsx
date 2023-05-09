import React from 'react'
import CommonNav from './commonNav'

describe('<CommonNav />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<CommonNav />)
  })
})