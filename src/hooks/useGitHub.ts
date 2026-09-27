import { useEffect, useState } from 'react';
import { profile } from '../data/portfolio';

export type Repo = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  topics?: string[];
};

export type GitHubUser = {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
  created_at: string;
};

type State = {
  status: 'loading' | 'ready' | 'unavailable';
  user: GitHubUser | null;
  repos: Repo[];
};

/**
 * Pulls live public GitHub data. If the API is unreachable or rate-limited the
 * hook reports `unavailable` — the UI then hides counts rather than inventing them.
 */
export function useGitHub(): State {
  const [state, setState] = useState<State>({ status: 'loading', user: null, repos: [] });

  useEffect(() => {
    const controller = new AbortController();
    const base = 'https://api.github.com';
    const opts: RequestInit = {
      signal: controller.signal,
      headers: { Accept: 'application/vnd.github+json' },
    };

    Promise.all([
      fetch(`${base}/users/${profile.githubUser}`, opts).then((r) => (r.ok ? r.json() : Promise.reject(r.status))),
      fetch(`${base}/users/${profile.githubUser}/repos?per_page=100&sort=updated`, opts).then((r) =>
        r.ok ? r.json() : Promise.reject(r.status),
      ),
    ])
      .then(([user, repos]: [GitHubUser, Repo[]]) => {
        const list = Array.isArray(repos) ? repos : [];
        setState({
          status: 'ready',
          user,
          repos: list
            .sort((a, b) => b.stargazers_count - a.stargazers_count || +new Date(b.updated_at) - +new Date(a.updated_at))
            .slice(0, 6),
        });
      })
      .catch(() => {
        if (!controller.signal.aborted) setState({ status: 'unavailable', user: null, repos: [] });
      });

    return () => controller.abort();
  }, []);

  return state;
}
