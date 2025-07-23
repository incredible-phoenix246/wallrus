export const useCases = [
    {
        title: "USE CASE",
        subtitle:
            "Extend isn't just a tool—it's a solution to a widespread problem: digital content disappearing when individuals can no longer support it.",
        image: null,
    },
    {
        title: "COMMUNITY TAKEOVER PROJECTS",
        subtitle:
            "When crypto projects are abandoned by their creators, communities are often left without access to important files like governance documents or websites. Extend empowers these communities to take ownership by collectively funding the permanent storage of essential project assets. This ensures the project's digital footprint survives, even without the original developers.",
        image: "/use1.png",
    },
    {
        title: "RESEARCH PAPERS & ACADEMIC WORK",
        subtitle:
            "Academic research can disappear when journals go offline or institutions lose funding—especially in the Global South. With Extend, researchers and their supporters can preserve articles, data, and findings indefinitely by pooling resources to keep them online. This protects knowledge that would otherwise be lost to time or inaccessibility.",
        image: "/use2.png",
    },
    {
        title: "OPEN SOURCE PROJECTS",
        subtitle:
            "When open-source maintainers burn out, the tools they've created often risk vanishing from the web. Extend gives developers and companies the ability to fund the long-term storage of libraries, documentation, and dependencies they rely on. This keeps critical software infrastructure accessible, no matter who originally built it.",
        image: "/use3.png",
    },
    {
        title: "CULTURAL PRESERVATION",
        subtitle:
            "Important cultural records—like indigenous knowledge, oral histories, and digital art—are often under-funded and vulnerable to loss. Extend offers a way for communities and institutions to preserve this content permanently by enabling global supporters to contribute to its storage. It's a decentralised safety net for our shared digital heritage.",
        image: "/use4.png",
    },
]

export const faqData = [
    {
        question: "WHAT IS EXTEND?",
        answer:
            "Extend is a decentralized application that allows anyone to fund and extend the storage lifetime of files stored on the Walrus blockchain. It ensures valuable content stays online through community contributions, rather than relying solely on the original uploader.",
        isOpen: true,
    },
    {
        question: "WHAT IS A SHAREDBLOB?",
        answer:
            "A SharedBlob is a file or digital object uploaded to the Walrus blockchain. Each SharedBlob has a funding pool and an associated storage time, measured in epochs. Anyone can contribute to keeping a SharedBlob online.",
        isOpen: false,
    },
    {
        question: "WHAT ARE WAL TOKENS?",
        answer:
            "WAL is the native token of the Walrus blockchain. These tokens are used to pay for storage time (epochs) on the network. Tipping WAL tokens to a SharedBlob increases its available funding for future storage.",
        isOpen: false,
    },
    {
        question: "WHAT ARE EPOCHS?",
        answer:
            "Epochs are the time units used on the Walrus blockchain to measure how long a file remains stored. The more epochs you fund, the longer the content stays accessible.",
        isOpen: false,
    },
    {
        question: "WHAT HAPPENS WHEN A FILE RUNS OUT OF EPOCHS?",
        answer:
            "If a SharedBlob's funding is depleted and its storage time expires, the file is removed from active availability. However, it can still be revived if someone adds new funding before complete deletion, depending on network rules.",
        isOpen: false,
    },
    {
        question: "WHO CAN TIP OR EXTEND STORAGE?",
        answer:
            "Anyone. You don't have to be the original uploader to contribute. Any user with WAL tokens can tip or extend the storage time for any SharedBlob they care about.",
        isOpen: false,
    },
]