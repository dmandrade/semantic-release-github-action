# Semantic Release Github Action

GitHub Action for [Semantic Release](https://github.com/semantic-release/semantic-release). 

This action use Semantic Release 16.0.0-beta.26

## Additional Instaled Plugins

- @semantic-release/git
- @semantic-release/changelog
- @semantic-release/exec

## Usage

Basic usage

```yaml
steps:
  - name: Semantic Release
    uses: dmandrade/semantic-release-github-action@v1
    id: release   # Need an `id` for output variables
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

Running action with extra plugins

```yaml
steps:
  - name: Semantic Release
    uses: dmandrade/semantic-release-github-action@v1
    id: release
    with:
      plugins: |
        @semantic-release/exec
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

A complete example sending new release to Sentry, for example.

```yaml
steps:
  - name: Semantic Release
    uses: dmandrade/semantic-release-github-action@v1
    id: release
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
      
  - name: Send Release to Sentry
    if: steps.release.outputs.published == 'true'
    uses: dmandrade/sentry-release-github-action@v1
    env:
      SENTRY_TOKEN: ${{ secrets.SENTRY_TOKEN }}
    with:
      org: foo
      project: bar
      environment: production
      version: steps.release.outputs.version
```

## Output Variables
- published: Whether a new release was published
- version: Version of the new release
