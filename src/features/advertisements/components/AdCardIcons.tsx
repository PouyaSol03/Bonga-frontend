type IconProps = {
  className?: string
}

export function AdCardAlbumIcon({ className = '' }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 20 20">
      <path
        d="M14.5 5.5H16C16.8284 5.5 17.5 6.17157 17.5 7V16C17.5 16.8284 16.8284 17.5 16 17.5H7C6.17157 17.5 5.5 16.8284 5.5 16V14.5M2.5 9.33887C2.96426 9.27985 3.43363 9.25075 3.90378 9.25173C5.89274 9.21498 7.83298 9.75723 9.37832 10.7818C10.8115 11.7321 11.8185 13.0397 12.25 14.5M10.7498 6.25H10.7566M14.5 13V4C14.5 3.17157 13.8284 2.5 13 2.5H4C3.17157 2.5 2.5 3.17157 2.5 4V13C2.5 13.8284 3.17157 14.5 4 14.5H13C13.8284 14.5 14.5 13.8284 14.5 13Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.3"
      />
    </svg>
  )
}

export function AdCardOwnerIcon({ className = '' }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 20 20">
      <path
        d="M4.903 17.5V3.25c0-.452.43-.77.866-.663l8.62 2.115a.72.72 0 0 1 .701.663l.01 12.135M3.334 17.5h13.333M8.824 7.75h2.353M8.824 10.75h2.353M8.432 17.5v-3c0-.413.352-.75.784-.75h1.569c.432 0 .784.337.784.75v3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.3"
      />
    </svg>
  )
}

export function AdCardTomanIcon({ className = '' }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 20 20">
      <path
        d="M16.844 10.742c.88 2.604 1.213 3.708-1.214 3.708h-1.214m0 0h-2.022c-2.185 0-1.455-3.131 0-3.131 1.454 0 1.86 1.071 2.022 3.131Zm0 0c.189 2.405-.809 2.473-3.398 3.05M5.678 13.461l1.861.989c1.294.688 2.114-2.22.81-2.884-1.1-.56-1.825.101-2.671 1.895Zm0 0c-.708 1.504-2.831 1.57-2.831-.247l-.162-4.12M7.62 2.5l.405 2.885c.323 1.648-.98 2.417-2.508 2.719-2.744.543-3.641-1.895-2.59-4.78M13.608 9.505h1.213m.81 0h1.213M4.708 2.5H5.92"
        stroke="currentColor"
        strokeWidth="1.3"
      />
    </svg>
  )
}

export function AdCardAreaIcon({ className = '' }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 20 20">
      <path
        d="M5 6.667H2.5M5 10H2.5M5 13.333H2.5M13.333 15v2.5M10 15v2.5M6.667 15v2.5M2.5 3.333v13.334c0 .46.373.833.833.833h13.334c.46 0 .833-.373.833-.833V12.5c0-.46-.373-.833-.833-.833H8.333V3.333c0-.46-.373-.833-.833-.833H3.333c-.46 0-.833.373-.833.833Z"
        stroke="currentColor"
        strokeWidth="1.3"
      />
    </svg>
  )
}

export function AdCardRoomsIcon({ className = '' }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 20 20">
      <path
        d="M2.5 16.667v-5.185c0-.818.672-1.482 1.5-1.482h12c.828 0 1.5.664 1.5 1.482v5.185M2.5 13.707h15M3.625 10V5.929c0-.204.17-.37.375-.37h1.371c.488 0 .97-.261 1.42-.737.73-.83 1.923-1.624 3.205-1.489 1.735.076 2.94.878 3.212 1.489.45.476.932.737 1.42.737H16c.205 0 .375.166.375.37V10M7 10V8.747c0-.388.223-.758.603-.921.484-.209 1.747-.698 2.397-.698s1.913.489 2.397.698c.38.163.603.533.603.921V10"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.3"
      />
    </svg>
  )
}

export function AdCardYearIcon({ className = '' }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 20 20">
      <path
        d="M4.167 16.667v-12.5c0-.92.746-1.667 1.666-1.667H12.5c.92 0 1.667.746 1.667 1.667V10M2.5 16.667h6.667M7.5 16.667v-2.5c0-.46.373-.834.833-.834h.834M7.458 5.357h2.834M7.458 7.857h2.834M7.458 10.357h2.834M14.583 13.333v1.25l.834.417"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.3"
      />
      <circle cx="14.583" cy="14.583" r="2.917" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  )
}
