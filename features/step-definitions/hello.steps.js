import { Given, Then } from '@cucumber/cucumber'
import { expect } from 'chai'

Given('the app is set up', function () {
  this.ready = true
})

Then('it should be ready', function () {
  expect(this.ready).to.equal(true)
})
