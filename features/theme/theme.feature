Feature: Theme switching
  As a user
  I want to toggle between light and dark themes
  So that I can use the app comfortably in any lighting condition

  Background:
    Given I have a fresh theme context with no saved preference

  Scenario: Default theme respects system preference for dark
    Given the system prefers dark mode
    When I resolve the initial theme
    Then the theme should be "dark"

  Scenario: Default theme respects system preference for light
    Given the system prefers light mode
    When I resolve the initial theme
    Then the theme should be "light"

  Scenario: Saved preference overrides system preference
    Given the system prefers dark mode
    And I have previously saved a "light" preference
    When I resolve the initial theme
    Then the theme should be "light"

  Scenario: Toggling from light sets dark
    Given the current theme is "light"
    When I toggle the theme
    Then the theme should be "dark"

  Scenario: Toggling from dark sets light
    Given the current theme is "dark"
    When I toggle the theme
    Then the theme should be "light"

  Scenario: Toggling persists the new theme
    Given the current theme is "light"
    When I toggle the theme
    Then "dark" should be saved to storage
