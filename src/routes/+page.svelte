<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { fetchMetadata } from '../util/prompt';

	let score = -1;
	let website = 'Unknown';
	let prevUrl: string | null = null;
	let dataCollected = 'Unknown';
	let lastDataBreach = 'Unknown';
	let industryBreachPotential = 'Unknown';
	let riskOfDataExposure = 'Unknown';
	let explanation = 'Unknown';
	let alternatives = 'Unknown';
	let loading = false;

	async function updateMetadata(site: string) {
		if (loading) return;

		loading = true;

		const metadata = await fetchMetadata(site);

		if (metadata !== null) {
			score = metadata.score;
			website = site;
			dataCollected = metadata.typeData;
			lastDataBreach = metadata.lastBreach;
			industryBreachPotential = metadata.breaches;
			riskOfDataExposure = metadata.risk;
			explanation = metadata.explanation;
			alternatives = metadata.alternatives;
		}

		loading = false;
	}

	onMount(async () => {
		chrome.tabs.onUpdated.addListener((_, __, tab) => {
			const url = tab.url ? new URL(tab.url).hostname : null;

			if (url && url !== prevUrl) {
				prevUrl = url;

				updateMetadata(url);
			}
		});

		chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
			const url = tabs[0].url ? new URL(tabs[0].url).hostname : null;

			if (url && url !== prevUrl) {
				prevUrl = url;

				updateMetadata(url);
			}
		});
	});
</script>

<div class="grid justify-center h-full w-screen max-w-prose my-16 mx-8">
	<span class="max-w-prose flex flex-col gap-5 overflow-hidden">
		<span class="mb-16">
			<span class="justify-center grid">
				<button
					id="score"
					class="btn {score === -1 || score > 70
						? 'hover:bg-success bg-success'
						: score < 30
						? 'hover:bg-error bg-error'
						: 'hover:bg-warning bg-warning'} rounded-full w-32 h-32 text-base-300 grid place-content-center font-bold text-3xl mx-5"
				>
					{#if loading}
						<div
							class="animate-spin inline-block border-[3px] border-current border-t-transparent rounded-full w-8 h-8"
							role="status"
							aria-label="loading"
						/>
					{:else}
						{score === -1 ? '?' : score}
					{/if}
				</button>
				<label class="label" for="score">
					<span class="label-text-alt" />
					<span class="label-text-alt text-lg -mt-=">/100</span>
				</label>
			</span>
			<h2
				class="text-xl text-center {score === -1 || score > 70
					? 'text-success'
					: score < 30
					? 'text-error'
					: 'text-warning'}"
			>
				+{score === -1 ? 0 : Math.floor(score / 7)} DataDefender Credits
			</h2>
		</span>

		<span>
			<h1 class="text-xl font-bold mb-2">
				Company Cyber Ethics & Digital Rights Analysis
			</h1>

			<span class="flex flex-col gap-4">
				<span>
					<h2 class="w-fit font-bold text-lg text-accent">Website</h2>
					<p class="whitespace-pre-wrap text-2xl">
						{website}
					</p>
				</span>

				<span>
					<h2 class="w-fit font-bold text-lg text-accent">Data collected</h2>
					<p class="whitespace-pre-wrap text-lg">{dataCollected}</p>
				</span>

				<span>
					<h2 class="w-fit font-bold text-lg text-accent">Last data breach</h2>
					<p class="whitespace-pre-wrap text-lg">{lastDataBreach}</p>
				</span>

				<span>
					<h2 class="w-fit font-bold text-lg text-accent">
						Industry breach potential
					</h2>
					<p class="whitespace-pre-wrap text-lg">{industryBreachPotential}</p>
				</span>

				<span>
					<h2 class="w-fit font-bold text-lg text-accent">
						Risk of data exposure
					</h2>
					<p class="whitespace-pre-wrap text-lg">{riskOfDataExposure}</p>
				</span>
			</span>

			{#if explanation}
				<div class="mt-8">
					<h1 class="text-xl font-bold text-accent">Explanation</h1>
					<p class="whitespace-pre-wrap text-lg">{explanation}</p>
				</div>
			{/if}

			{#if alternatives}
				<div class="mt-8">
					<h1 class="text-xl font-bold text-accent">Alternatives</h1>
					<p class="whitespace-wrap text-lg">{alternatives}</p>
				</div>
			{/if}
		</span>
	</span>
</div>

<style global>
	html::-webkit-scrollbar {
		display: none;
	}

	html {
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}
</style>
