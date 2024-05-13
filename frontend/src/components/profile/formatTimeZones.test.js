import formatTimeZones from "./formatTimeZones";

test("format time zone strings to antd Cascader format", () => {
  const inputStrings = [
    "Africa/Abidjan",
    "Europe/Amsterdam",
    "Europe/Andorra",
    "Asia/Aden",
    "Asia/Almaty",
    "Asia/Amman",
    "America/Argentina/Buenos_Aires",
    "America/North_Dakota/Beulah",
    "America/North_Dakota/Center",
  ];
  const output = formatTimeZones(inputStrings);
  expect(output).toEqual([
    {
      value: "Africa",
      label: "Africa",
      children: [{ value: "Abidjan", label: "Abidjan" }],
    },
    {
      value: "Europe",
      label: "Europe",
      children: [
        {
          value: "Amsterdam",
          label: "Amsterdam",
        },
        {
          value: "Andorra",
          label: "Andorra",
        },
      ],
    },
    {
      value: "Asia",
      label: "Asia",
      children: [
        {
          value: "Aden",
          label: "Aden",
        },
        {
          value: "Almaty",
          label: "Almaty",
        },
        {
          value: "Amman",
          label: "Amman",
        },
      ],
    },
    {
      value: "America",
      label: "America",
      children: [
        {
          value: "Argentina",
          label: "Argentina",
          children: [
            {
              value: "Buenos_Aires",
              label: "Buenos_Aires",
            },
          ],
        },
        {
          value: "North_Dakota",
          label: "North_Dakota",
          children: [
            {
              value: "Beulah",
              label: "Beulah",
            },
            {
              value: "Center",
              label: "Center",
            },
          ],
        },
      ],
    },
  ]);
});
