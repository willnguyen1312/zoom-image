import { execFileSync, spawnSync } from "node:child_process"

type WorkspacePackage = {
  name?: string
  version?: string
  private?: boolean
}

function getReleaseTags(): string[] {
  const output = execFileSync("pnpm", ["ls", "--recursive", "--depth", "-1", "--json"], { encoding: "utf8" })
  const workspacePackages: WorkspacePackage[] = JSON.parse(output)

  return workspacePackages.reduce<string[]>((releaseTags, { name, version, private: isPrivate }) => {
    if (!isPrivate && name && version) releaseTags.push(`${name}@${version}`)
    return releaseTags
  }, [])
}

function getRemoteTags(): Set<string> {
  const output = execFileSync("git", ["ls-remote", "--tags", "--refs", "origin"], { encoding: "utf8" })

  return output.split("\n").reduce((remoteTags, line) => {
    const [, ref] = line.split("\t")
    if (ref) remoteTags.add(ref.replace("refs/tags/", ""))
    return remoteTags
  }, new Set<string>())
}

const remoteTags = getRemoteTags()
const untaggedReleaseTags = getReleaseTags().filter((releaseTag) => !remoteTags.has(releaseTag))

if (untaggedReleaseTags.length === 0) {
  console.log("Every package version is already tagged, skipping release")
} else {
  console.log(`Releasing untagged versions: ${untaggedReleaseTags.join(", ")}`)
  const { status } = spawnSync("pnpm", ["release"], { stdio: "inherit" })
  process.exit(status ?? 1)
}
