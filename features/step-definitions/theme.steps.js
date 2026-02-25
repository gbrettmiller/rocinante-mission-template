import { Before, Given, When, Then } from '@cucumber/cucumber'
import { expect } from 'chai'
import { createTheme } from '../../src/theme.js'

Before(function () {
  this.storage = { data: {}, getItem: (k) => this.storage.data[k] ?? null, setItem: (k, v) => { this.storage.data[k] = v } }
  this.prefersDark = () => false
  this.theme = null
  this.current = null
})

Given('I have a fresh theme context with no saved preference', function () {
  // handled by Before hook
})

Given('the system prefers dark mode', function () {
  this.prefersDark = () => true
})

Given('the system prefers light mode', function () {
  this.prefersDark = () => false
})

Given('I have previously saved a {string} preference', function (pref) {
  this.storage.setItem('theme', pref)
})

Given('the current theme is {string}', function (theme) {
  this.current = theme
})

When('I resolve the initial theme', function () {
  this.theme = createTheme({ storage: this.storage, prefersDark: this.prefersDark }).resolve()
})

When('I toggle the theme', function () {
  const controller = createTheme({ storage: this.storage, prefersDark: this.prefersDark })
  this.theme = controller.toggle(this.current)
})

Then('the theme should be {string}', function (expected) {
  expect(this.theme).to.equal(expected)
})

Then('{string} should be saved to storage', function (expected) {
  expect(this.storage.getItem('theme')).to.equal(expected)
})
