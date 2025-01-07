import { onMounted, onUnmounted } from 'vue'

export function useSyncCodeGroups() {
    let observer: MutationObserver | null = null

    const updateGroupVisibility = (blocks: NodeListOf<Element>, selectedIndex: number) => {
        blocks.forEach((block, blockIndex) => {
            if (block instanceof HTMLElement) {
                // 移除所有可能影响显示的类和样式
                block.classList.remove('active')
                block.style.removeProperty('display')

                if (blockIndex === selectedIndex) {
                    block.classList.add('active')
                    block.style.display = 'block'
                } else {
                    block.style.display = 'none'
                }
            }
        })
    }

    const setupCodeGroupSync = () => {
        const codeGroups = Array.from(document.querySelectorAll('.vp-code-group'))
        const groupedCodeBlocks = new Map<string, HTMLElement[]>()

        codeGroups.forEach((group) => {
            const tabs = group.querySelectorAll('.tabs label')
            const blocks = group.querySelectorAll('.blocks > div')

            const tabTitles = Array.from(tabs).map(tab => tab.textContent?.trim())
            const blockTypes = Array.from(blocks).map(block => {
                const pre = block.querySelector('pre')
                const code = pre?.querySelector('code')
                return code?.className || ''
            })

            const key = `${tabTitles.join('|')}::${blockTypes.join('|')}`

            if (key && tabTitles.length > 1) {
                if (!groupedCodeBlocks.has(key)) {
                    groupedCodeBlocks.set(key, [])
                }
                groupedCodeBlocks.get(key)?.push(group as HTMLElement)
            }
        })

        groupedCodeBlocks.forEach((groups) => {
            if (groups.length < 2) return

            groups.forEach((group) => {
                const tabs = group.querySelectorAll('.tabs label')
                const inputs = group.querySelectorAll('.tabs input')
                const blocks = group.querySelectorAll('.blocks > div')

                tabs.forEach((tab, index) => {
                    try {
                        const newTab = tab.cloneNode(true)
                        tab.parentNode?.replaceChild(newTab, tab)

                        newTab.addEventListener('click', () => {
                            try {
                                groups.forEach((syncGroup) => {
                                    const syncInputs = syncGroup.querySelectorAll('.tabs input')
                                    const syncBlocks = syncGroup.querySelectorAll('.blocks > div')

                                    if (syncInputs[index]) {
                                        const input = syncInputs[index] as HTMLInputElement
                                        if (!input.checked) {
                                            input.checked = true
                                        }
                                    }

                                    // 使用新的更新函数
                                    updateGroupVisibility(syncBlocks, index)
                                })
                            } catch (error) {
                                console.error('Error in click handler:', error)
                            }
                        })
                    } catch (error) {
                        console.error('Error setting up tab:', error)
                    }
                })

                // 设置初始显示状态
                try {
                    const checkedIndex = Array.from(inputs).findIndex(
                        input => (input as HTMLInputElement).checked
                    )
                    if (checkedIndex !== -1) {
                        // 使用新的更新函数设置初始状态
                        updateGroupVisibility(blocks, checkedIndex)
                    }
                } catch (error) {
                    console.error('Error setting initial state:', error)
                }
            })
        })
    }

    onMounted(() => {
        setupCodeGroupSync()

        observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    const hasCodeGroup = Array.from(mutation.addedNodes).some(
                        node => node instanceof Element &&
                            (node.classList.contains('vp-code-group') ||
                                node.querySelector('.vp-code-group'))
                    )
                    if (hasCodeGroup) {
                        setTimeout(setupCodeGroupSync, 0)
                        break
                    }
                }
            }
        })

        observer.observe(document.body, {
            childList: true,
            subtree: true
        })
    })

    onUnmounted(() => {
        observer?.disconnect()
    })
} 